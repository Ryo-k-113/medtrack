/**
 * prisma/seed/raw/ の元データ3ファイルから、投入用の seed-data.json.gz を生成する
 *
 * 元データ
 *   医薬品供給1.csv        厚労省の供給状況一覧表。医薬品の基本情報と出荷状況
 *   HOTコード一覧表1.csv    MEDISのHOTコード。製造会社・販売会社と、包装同士の突合キー
 *   gs1コード一覧表1.csv    GS1コード。包装の情報
 *
 * 実行: npm run seed:build
 */
import { createHash } from "node:crypto"
import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { gzipSync } from "node:zlib"

import { parse } from "csv-parse/sync"

const RAW_DIR = path.join(process.cwd(), "prisma/seed/raw")
const OUT_FILE = path.join(process.cwd(), "prisma/seed/seed-data.json.gz")

// 元データのファイル名
const SUPPLY_FILE = "医薬品供給1.csv"
const HOT_FILE = "HOTコード一覧表1.csv"
const GS1_FILE = "gs1コード一覧表1.csv"

type ProductType = "BRAND_NAME" | "QUASI_BRAND_NAME" | "GENERIC" | "OTHER"
type ShippingStatus =
  | "NORMAL_SHIPMENT"
  | "LIMITED_SHIPMENT"
  | "SHIPMENT_SUSPENDED"
  | "DISCONTINUED_SALE"

type SeedPackage = {
  name: string
  gs1SalesCode: string
  gs1DispensingCode: string | null
  hotCode: string
  currentShippingStatus: ShippingStatus
  discontinuedDate: string | null
}

type SeedDrug = {
  name: string
  yjCode: string
  drugPriceListingCode: string | null
  productType: ProductType
  transitionalMeasuresDate: string | null
  unit: string
  genericName: string
  manufacturingCompany: string
  salesCompany: string
  packages: SeedPackage[]
}

// ---------------------------------------------------------------- 読み込み

const readCsv = (fileName: string): string[][] =>
  parse(readFileSync(path.join(RAW_DIR, fileName)), {
    bom: true,
    relaxColumnCount: true,
    skipEmptyLines: true,
  })

/** ヘッダー行から、指定した文字列を含む列の位置を探す */
const findColumn = (header: string[], keyword: string, fileName: string): number => {
  const index = header.findIndex((cell) => cell.replace(/\s/g, "").includes(keyword))
  if (index === -1) {
    throw new Error(`${fileName}: 「${keyword}」を含む列が見つかりません`)
  }
  return index
}

/** ヘッダー名をキーにしたレコードの配列として読む */
const readCsvAsRecords = (fileName: string): Record<string, string>[] => {
  const rows = readCsv(fileName)
  const header = rows[0].map((cell) => cell.trim())
  return rows.slice(1).map((row) => {
    const record: Record<string, string> = {}
    header.forEach((key, i) => {
      record[key] = (row[i] ?? "").trim()
    })
    return record
  })
}

// ---------------------------------------------------------------- 変換

/**
 * 全角の英数字・記号・空白を半角にする。
 * 元データは「２．５ｍｇ」のように全角で記載されているため、表記を半角に統一する。
 * かな・漢字・カタカナはそのまま。ローマ数字（第Ⅷ因子など）や ㎡ も変換しないため、
 * NFKC正規化ではなく変換範囲を限定している
 */
const toHalfWidth = (value: string): string =>
  value
    .replace(/[！-～]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/　/g, " ")
    .trim()

/** 「20260331」形式の日付を ISO 文字列にする。日付として不正なものは null */
const parseCompactDate = (value: string): string | null => {
  if (!/^\d{8}$/.test(value)) return null
  const year = Number(value.slice(0, 4))
  const month = Number(value.slice(4, 6))
  const day = Number(value.slice(6, 8))
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  return date.toISOString()
}

/** 供給状況一覧表の「⑧製品区分」をスキーマの製品区分に対応させる */
const toProductType = (value: string): ProductType => {
  // 長期収載品は後発品のある先発品なので先発品として扱う
  if (value.includes("先発品") && !value.includes("準先発品")) return "BRAND_NAME"
  if (value.includes("長期収載品")) return "BRAND_NAME"
  if (value.includes("準先発品")) return "QUASI_BRAND_NAME"
  if (value.includes("後発品")) return "GENERIC"
  // その他医薬品・未収載医薬品
  return "OTHER"
}

/** 供給状況一覧表の「⑫出荷対応の状況」をスキーマの出荷状況に対応させる */
const toShippingStatus = (value: string): ShippingStatus => {
  if (value.includes("限定出荷")) return "LIMITED_SHIPMENT"
  if (value.includes("供給停止")) return "SHIPMENT_SUSPENDED"
  if (value.includes("販売中止")) return "DISCONTINUED_SALE"
  return "NORMAL_SHIPMENT"
}

/**
 * 調剤包装単位コードを14桁に戻す。
 * 元データは表計算ソフトを経由して先頭の0が落ち13桁になっているため補う
 */
const restoreDispensingCode = (value: string): string | null => {
  if (!value) return null
  if (!/^\d{13,14}$/.test(value)) return null
  return value.padStart(14, "0")
}

/** 包装名を「PTP100錠」の形に組み立てる */
const buildPackageName = (form: string, amount: string, unit: string): string =>
  toHalfWidth(`${form}${amount}${unit}`).replace(/\s+/g, "")

/** HOTコードの8〜9桁目の会社識別用番号。販売移管の順に増える */
const companySequence = (hotCode: string): number => Number(hotCode.slice(7, 9)) || 0

// ---------------------------------------------------------------- 本体

const main = () => {
  // 供給状況一覧表はヘッダーが2行目にあり、列名に丸数字や改行を含むため位置で引く
  const supplyRows = readCsv(SUPPLY_FILE)
  const supplyHeader = (supplyRows[1] ?? []).map((cell) => cell.trim())
  const col = {
    genericName: findColumn(supplyHeader, "成分名", SUPPLY_FILE),
    unit: findColumn(supplyHeader, "規格単位", SUPPLY_FILE),
    yjCode: findColumn(supplyHeader, "YJコード", SUPPLY_FILE),
    name: findColumn(supplyHeader, "製品名", SUPPLY_FILE),
    productType: findColumn(supplyHeader, "製品区分", SUPPLY_FILE),
    shippingStatus: findColumn(supplyHeader, "出荷対応", SUPPLY_FILE),
  }

  const supplyByYjCode = new Map<string, string[]>()
  for (const row of supplyRows.slice(2)) {
    const yjCode = (row[col.yjCode] ?? "").trim()
    // 未収載医薬品はYJコードが12桁でない仮コードのため除外する
    if (yjCode.length !== 12) continue
    supplyByYjCode.set(yjCode, row)
  }

  // 販売包装単位コードからHOTコードの行を引けるようにする
  const hotByPackageCode = new Map<string, Record<string, string>[]>()
  for (const row of readCsvAsRecords(HOT_FILE)) {
    const packageCode = row["販売包装単位コード"]
    if (!packageCode) continue
    const list = hotByPackageCode.get(packageCode)
    if (list) list.push(row)
    else hotByPackageCode.set(packageCode, [row])
  }

  const skipped = {
    hotに販売包装コードが無い: 0,
    YJコードが空または複数: 0,
    供給リストに無いYJコード: 0,
    販売GS1コードの重複: 0,
  }

  // 医薬品はYJコードと販売会社の組み合わせで一意になる（併売・販売移管があるため）
  const drugs = new Map<string, SeedDrug>()
  const usedSalesCodes = new Set<string>()
  const hotRowsByDrug = new Map<string, Record<string, string>[]>()
  let transitionalConflicts = 0

  for (const gs1 of readCsvAsRecords(GS1_FILE)) {
    const salesCode = gs1["販売包装単位コード"]
    const hotRows = hotByPackageCode.get(salesCode)
    if (!hotRows) {
      skipped.hotに販売包装コードが無い += 1
      continue
    }
    const yjCodes = new Set(hotRows.map((row) => row["YJコード"]).filter(Boolean))
    if (yjCodes.size !== 1) {
      skipped.YJコードが空または複数 += 1
      continue
    }
    const yjCode = Array.from(yjCodes)[0]
    const supply = supplyByYjCode.get(yjCode)
    if (!supply) {
      skipped.供給リストに無いYJコード += 1
      continue
    }
    if (usedSalesCodes.has(salesCode)) {
      skipped.販売GS1コードの重複 += 1
      continue
    }
    usedSalesCodes.add(salesCode)

    const hot = hotRows[0]
    const salesCompany = toHalfWidth(hot["販売会社"])
    const drugKey = `${yjCode} ${salesCompany}`

    const status = toShippingStatus((supply[col.shippingStatus] ?? "").trim())
    const discontinuedDate = parseCompactDate(gs1["販売中止年月日"])
    // 販売中止日が過去の包装は、製品が出荷中でも販売中止として扱う
    const isDiscontinued = discontinuedDate !== null && new Date(discontinuedDate) <= new Date()

    const pkg: SeedPackage = {
      name: buildPackageName(gs1["包装形態"], gs1["総数量数"], gs1["総数量数単位"]),
      gs1SalesCode: salesCode,
      gs1DispensingCode: restoreDispensingCode(gs1["調剤包装単位コード"]),
      hotCode: hot["HOTコード"],
      currentShippingStatus: isDiscontinued ? "DISCONTINUED_SALE" : status,
      discontinuedDate,
    }

    const existing = drugs.get(drugKey)
    if (existing) {
      existing.packages.push(pkg)
      if (!existing.drugPriceListingCode) {
        existing.drugPriceListingCode = hot["薬価基準コード"] || gs1["薬価収載コード"] || null
      }
      // 経過措置日は医薬品単位の情報なので、包装間で違う場合は遅い日付を採る
      const transitional = parseCompactDate(gs1["経過措置日"])
      if (transitional && transitional !== existing.transitionalMeasuresDate) {
        if (existing.transitionalMeasuresDate) transitionalConflicts += 1
        if (
          !existing.transitionalMeasuresDate ||
          transitional > existing.transitionalMeasuresDate
        ) {
          existing.transitionalMeasuresDate = transitional
        }
      }
    } else {
      drugs.set(drugKey, {
        name: toHalfWidth(supply[col.name] ?? ""),
        yjCode,
        drugPriceListingCode: hot["薬価基準コード"] || gs1["薬価収載コード"] || null,
        productType: toProductType((supply[col.productType] ?? "").trim()),
        transitionalMeasuresDate: parseCompactDate(gs1["経過措置日"]),
        unit: toHalfWidth(supply[col.unit] ?? ""),
        genericName: toHalfWidth(supply[col.genericName] ?? ""),
        manufacturingCompany: toHalfWidth(hot["製造会社"]),
        salesCompany,
        packages: [pkg],
      })
    }

    const rows = hotRowsByDrug.get(drugKey)
    if (rows) rows.push(hot)
    else hotRowsByDrug.set(drugKey, [hot])
  }

  // 製造会社が1社に定まらない医薬品は、会社識別用番号が大きい（新しい）方を採る
  let manufacturerConflicts = 0
  for (const [drugKey, drug] of Array.from(drugs)) {
    const hotRows = hotRowsByDrug.get(drugKey) ?? []
    const makers = new Set(hotRows.map((row) => row["製造会社"]).filter(Boolean))
    if (makers.size > 1) {
      manufacturerConflicts += 1
      const newest = hotRows
        .slice()
        .sort((a, b) => companySequence(b["HOTコード"]) - companySequence(a["HOTコード"]))[0]
      drug.manufacturingCompany = toHalfWidth(newest["製造会社"])
    }
  }

  const drugList = Array.from(drugs.values()).filter(
    (drug) =>
      drug.name && drug.unit && drug.genericName && drug.manufacturingCompany && drug.salesCompany
  )
  const incomplete = drugs.size - drugList.length

  const units = Array.from(new Set(drugList.map((d) => d.unit))).sort()
  const genericNames = Array.from(new Set(drugList.map((d) => d.genericName))).sort()
  const companies = Array.from(
    new Set(drugList.flatMap((d) => [d.manufacturingCompany, d.salesCompany]))
  ).sort()

  const packageCount = drugList.reduce((sum, d) => sum + d.packages.length, 0)
  const payload = {
    generatedAt: new Date().toISOString(),
    source: [SUPPLY_FILE, HOT_FILE, GS1_FILE],
    units,
    genericNames,
    companies,
    drugs: drugList,
  }

  const json = JSON.stringify(payload)
  writeFileSync(OUT_FILE, gzipSync(json, { level: 9 }))

  console.log("--- 除外した包装")
  for (const [reason, count] of Object.entries(skipped)) {
    console.log(`  ${reason}: ${count.toLocaleString()}`)
  }
  console.log("\n--- 生成結果")
  console.log(`  医薬品            : ${drugList.length.toLocaleString()}`)
  console.log(`  包装              : ${packageCount.toLocaleString()}`)
  console.log(`  規格単位          : ${units.length.toLocaleString()}`)
  console.log(`  成分名            : ${genericNames.length.toLocaleString()}`)
  console.log(`  製薬会社          : ${companies.length.toLocaleString()}`)
  console.log(`  製造会社を新しい方で解決: ${manufacturerConflicts.toLocaleString()}`)
  console.log(`  経過措置日が包装間で不一致: ${transitionalConflicts.toLocaleString()}`)
  console.log(`  必須項目が欠けて除外   : ${incomplete.toLocaleString()}`)
  console.log(
    `\n  ${path.relative(process.cwd(), OUT_FILE)} ` +
      `(${(gzipSync(json, { level: 9 }).length / 1024 / 1024).toFixed(1)}MB, ` +
      `元 ${(json.length / 1024 / 1024).toFixed(1)}MB)`
  )
  console.log(`  sha256: ${createHash("sha256").update(json).digest("hex").slice(0, 16)}`)
}

main()
