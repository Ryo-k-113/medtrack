/**
 * prisma/seed/raw/ の元データ3ファイルから、投入用の seed-data.json.gz を生成する
 *
 * 元データ
 *   医薬品供給1.csv        厚労省の供給状況一覧表。医薬品の基本情報と出荷状況
 *   HOTコード一覧表1.csv    MEDISのHOTコード。製造会社・販売会社と、包装同士の突合キー
 *   gs1コード一覧表1.csv    GS1コード。包装の情報
 *   price/*.csv            厚労省の薬価基準収載品目リスト。薬価（任意。無ければ薬価は空）
 *
 * prisma/seed/excluded-packages.json に挙げた包装は、生成の対象から除く
 * （メーカーのサイトで現行品か確認できず、DBからも削除した包装。投入し直しても復活させない）
 *
 * 実行: npm run seed:build
 */
import { createHash } from "node:crypto"
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { gzipSync } from "node:zlib"

import { parse } from "csv-parse/sync"

import {
  buildPackageInfo,
  toHalfWidth,
  unusedOverrides,
  type Gs1PackageRow,
} from "./package-name"
import { writeReviewCsv } from "./review-csv"

const RAW_DIR = path.join(process.cwd(), "prisma/seed/raw")
const OUT_FILE = path.join(process.cwd(), "prisma/seed/seed-data.json.gz")
// 生成の対象から除く包装の指定
const EXCLUDED_FILE = path.join(process.cwd(), "prisma/seed/excluded-packages.json")
// 剤形を名前で判定した医薬品の確認用一覧（gitの管理外）
const DOSAGE_FORM_REVIEW_FILE = path.join(RAW_DIR, "match/剤形の判定.csv")
// 包装名・内訳・注記の確認用一覧（gitの管理外）
const PACKAGE_NAME_REVIEW_FILE = path.join(RAW_DIR, "match/包装名と内訳.csv")

// 元データのファイル名
const SUPPLY_FILE = "医薬品供給1.csv"
const HOT_FILE = "HOTコード一覧表1.csv"
const GS1_FILE = "gs1コード一覧表1.csv"
// 薬価のファイルを置くフォルダ（区分ごとに複数ファイルを置ける）
const PRICE_DIR = "price"

type ProductType = "BRAND_NAME" | "QUASI_BRAND_NAME" | "GENERIC" | "OTHER"
type DrugCategory = "INTERNAL" | "INJECTION" | "EXTERNAL" | "DENTAL"
type DosageForm =
  | "TABLET"
  | "OD_TABLET"
  | "CAPSULE"
  | "POWDER"
  | "LIQUID"
  | "SKIN_APPLICATION"
  | "EYE_EAR_NOSE"
  | "PATCH"
  | "SUPPOSITORY"
  | "INHALANT"
  | "INJECTION"
  | "OTHER"
type ShippingStatus =
  | "NORMAL_SHIPMENT"
  | "LIMITED_SHIPMENT"
  | "SHIPMENT_SUSPENDED"
  | "DISCONTINUED_SALE"

type SeedPackage = {
  name: string
  /** 内訳（「10錠×10」）。無い場合は null */
  breakdown: string | null
  /** 注記（「広口開栓型」）。無い場合は null */
  variant: string | null
  /** 旧規則で作った包装名（投入済みDBの上書き判定に使う。DBには入れない） */
  legacyName: string
  gs1SalesCode: string
  gs1DispensingCode: string | null
  hotCode: string
  unifiedCode: string | null
  currentShippingStatus: ShippingStatus
  discontinuedDate: string | null
}

type SeedDrug = {
  name: string
  yjCode: string
  drugPriceListingCode: string | null
  price: number | null
  productType: ProductType
  category: DrugCategory | null
  dosageForm: DosageForm | null
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

/** GS1コード一覧表の「区分名」をスキーマの区分に対応させる */
const toDrugCategory = (value: string): DrugCategory | null => {
  if (value.includes("内用")) return "INTERNAL"
  if (value.includes("注射")) return "INJECTION"
  if (value.includes("外用")) return "EXTERNAL"
  if (value.includes("歯科")) return "DENTAL"
  return null
}

// ---------------------------------------------------------------- 剤形

/** 口腔内で崩壊・溶解する錠剤の名前（OD錠、ガスターD錠、ゾーミッグRM錠、ジプレキサザイディス錠、ODフィルム） */
const OD_TABLET_PATTERN = /OD錠|ODフィルム|(?<![A-Za-z])D錠|RM錠|ザイディス/

/** 吸入器の名前。名前に「吸入」を含まない吸入薬を拾う（呼吸器系の薬に限って使う） */
const INHALER_DEVICE_PATTERN =
  /インヘラー|ディスカス|エリプタ|タービュヘイラー|レスピマット|エアロスフィア|スイングヘラー|ブリーズヘラー|ジェニュエア|エアゾール|エロゾル/

/** 呼吸器系の薬効分類（YJコードの先頭3桁。225 気管支拡張剤、229 その他の呼吸器官用薬） */
const RESPIRATORY_CLASSES = ["225", "229"]

/**
 * GS1の剤形が「その他」「液剤」になっている外用薬を、名前で正しい分類へ戻す規則
 * GS1が明確に分類している場合は使わない（上から順に判定する）
 */
const EXTERNAL_NAME_RULES: { form: DosageForm; pattern: RegExp }[] = [
  { form: "EYE_EAR_NOSE", pattern: /点眼|点鼻|点耳|耳科|眼軟膏|眼科用/ },
  { form: "PATCH", pattern: /テープ|パップ|貼付|プラスター/ },
  { form: "SUPPOSITORY", pattern: /坐剤|坐薬|浣腸|[膣腟]錠|[膣腟]坐剤/ },
  { form: "SKIN_APPLICATION", pattern: /軟膏|クリーム|ゲル|ローション/ },
]

/**
 * GS1の剤形が「その他」「空欄」になっている内用薬を、名前で正しい分類へ戻す規則
 * （上から順に判定する。「シロップ用細粒」は散剤とするため、散剤を液剤より先に置く）
 */
const INTERNAL_NAME_RULES: { form: DosageForm; pattern: RegExp }[] = [
  { form: "CAPSULE", pattern: /カプセル/ },
  { form: "POWDER", pattern: /散|顆粒|細粒|ドライシロップ|原末/ },
  { form: "LIQUID", pattern: /液|シロップ/ },
  { form: "TABLET", pattern: /錠/ },
]

/** 剤形の判定結果と、その根拠（確認用の一覧に出す） */
type DosageFormResult = { form: DosageForm; reason: string; byName: boolean }

/**
 * 剤形を判定する
 * 基本はGS1の「区分名」と「剤形」の組み合わせで決め、GS1では埋もれるOD錠と吸入薬、
 * GS1の分類が明らかに誤っている外用薬だけを、医薬品名と薬効分類で補う
 */
const toDosageForm = (drug: {
  name: string
  yjCode: string
  category: DrugCategory | null
  gs1Form: string
}): DosageFormResult => {
  const { name, yjCode, category, gs1Form } = drug
  const fromGs1 = (form: DosageForm): DosageFormResult => ({ form, reason: `GS1: ${gs1Form}`, byName: false })
  const byName = (form: DosageForm, reason: string): DosageFormResult => ({ form, reason, byName: true })

  if (category === "INJECTION") return fromGs1("INJECTION")

  if (category === "INTERNAL") {
    // OD錠はGS1では錠剤・散剤・その他に分かれるため、名前を優先する
    if (OD_TABLET_PATTERN.test(name)) return byName("OD_TABLET", "名前: OD錠など")
    if (gs1Form.includes("錠")) return fromGs1("TABLET")
    if (gs1Form.includes("カプセル")) return fromGs1("CAPSULE")
    if (gs1Form.includes("散")) return fromGs1("POWDER")
    if (gs1Form.includes("液")) return fromGs1("LIQUID")

    // GS1が分類していないものは、名前で補う
    const rule = INTERNAL_NAME_RULES.find(({ pattern }) => pattern.test(name))
    if (rule) return byName(rule.form, `名前: GS1の「${gs1Form || "空欄"}」を補正`)
    return fromGs1("OTHER")
  }

  if (category === "EXTERNAL") {
    // 吸入薬はGS1ではその他・液剤・診断用に分かれるため、最初に判定する
    const isRespiratory = RESPIRATORY_CLASSES.includes(yjCode.slice(0, 3))
    if (name.includes("吸入")) return byName("INHALANT", "名前: 吸入")
    if (INHALER_DEVICE_PATTERN.test(name) && yjCode.startsWith("22")) {
      return byName("INHALANT", "名前: 吸入器＋呼吸器系")
    }
    if (isRespiratory && (gs1Form.includes("液") || gs1Form.includes("その他"))) {
      return byName("INHALANT", "薬効分類: 呼吸器系の液剤・その他")
    }

    if (gs1Form.includes("皮膚")) return fromGs1("SKIN_APPLICATION")
    if (gs1Form.includes("眼") || gs1Form.includes("耳鼻")) return fromGs1("EYE_EAR_NOSE")
    if (gs1Form.includes("貼付")) return fromGs1("PATCH")
    if (gs1Form.includes("挿入")) return fromGs1("SUPPOSITORY")

    // 口腔用の軟膏などは皮膚に塗る薬ではないため、名前での補正から外す
    if (!name.includes("口腔")) {
      const rule = EXTERNAL_NAME_RULES.find(({ pattern }) => pattern.test(name))
      if (rule) return byName(rule.form, `名前: GS1の「${gs1Form || "空欄"}」を補正`)
    }
    return fromGs1("OTHER")
  }

  // 歯科用薬剤・区分が無いもの
  return fromGs1("OTHER")
}

/**
 * 同じ製品（YJコード）の剤形を1つにそろえる
 * GS1の剤形は販売会社ごとに登録されるため、併売品で判定が割れることがある
 * 1. 「その他」以外があればそちらを採る  2. 割れた場合は多い方  3. 同数なら名前の規則に合う方
 * @returns そろえた剤形（そろえる必要が無い場合は null）
 */
const unifyDosageForm = (drugs: { name: string; category: DrugCategory | null; form: DosageForm }[]): DosageForm | null => {
  const forms = new Set(drugs.map((drug) => drug.form))
  if (forms.size <= 1) return null

  const counts = new Map<DosageForm, number>()
  drugs.forEach(({ form }) => {
    if (form !== "OTHER") counts.set(form, (counts.get(form) ?? 0) + 1)
  })
  if (counts.size === 0) return null

  const max = Math.max(...Array.from(counts.values()))
  const candidates = Array.from(counts).filter(([, count]) => count === max).map(([form]) => form)
  if (candidates.length === 1) return candidates[0]

  // 同数の場合は、医薬品名が名前の規則に合う剤形を採る（ドライシロップ → 散剤など）
  const { name, category } = drugs[0]
  const rules = category === "INTERNAL" ? INTERNAL_NAME_RULES : EXTERNAL_NAME_RULES
  const byName = rules.find(({ form, pattern }) => candidates.includes(form) && pattern.test(name))
  return byName?.form ?? candidates[0]
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

/**
 * 販売包装単位コード（GS1の14桁）から統一商品コード（9桁）を作る
 * 6〜13桁目の8桁に、2〜13桁目の12桁から計算したチェックデジットを付ける
 * （12桁を左から1倍・3倍と交互に掛けて合計し、10から1の位を引いた値。1の位が0なら0）
 * @example 14987185807149 → 185807142
 */
const toUnifiedCode = (gs1SalesCode: string): string | null => {
  if (!/^\d{14}$/.test(gs1SalesCode)) return null
  const body = gs1SalesCode.slice(1, 13)
  const sum = Array.from(body).reduce(
    (total, digit, index) => total + Number(digit) * (index % 2 === 0 ? 1 : 3),
    0
  )
  return `${gs1SalesCode.slice(5, 13)}${(10 - (sum % 10)) % 10}`
}

/** HOTコードの8〜9桁目の会社識別用番号。販売移管の順に増える */
const companySequence = (hotCode: string): number => Number(hotCode.slice(7, 9)) || 0

// ---------------------------------------------------------------- 薬価

/** 薬価基準収載医薬品コードの形式（半角英数の12桁） */
const PRICE_CODE_PATTERN = /^[0-9A-Z]{12}$/

/** 薬価の読み込み結果 */
type PriceReadResult = {
  prices: Map<string, number>
  files: string[]
  /** 取り出せなかった件数と、その例 */
  errors: string[]
  /** 同じコードに違う薬価があった件数（後のファイル・行の薬価を採用） */
  conflicts: number
}

/** 「1,812.60」のような薬価を数値にする */
const toPrice = (value: string): number | null => {
  const price = Number(value.replace(/,/g, ""))
  return Number.isFinite(price) && price >= 0 ? price : null
}

/**
 * 見出しの行がある形式（厚労省のExcelをCSVに保存したもの）を読む
 * 見出しが見つからない場合は null を返し、PDFを変換した形式として読み直す
 */
const readPriceWithHeader = (rows: string[][]): [string, string][] | null => {
  const normalize = (cell: string) => toHalfWidth(cell).replace(/\s/g, "")
  const headerIndex = rows
    .slice(0, 20)
    .findIndex((row) => row.map(normalize).includes("薬価基準収載医薬品コード"))
  if (headerIndex === -1) return null

  const header = rows[headerIndex].map(normalize)
  const codeIndex = header.indexOf("薬価基準収載医薬品コード")
  const priceIndex = header.indexOf("薬価")
  if (priceIndex === -1) return null

  return rows
    .slice(headerIndex + 1)
    .map((row): [string, string] => [row[codeIndex] ?? "", row[priceIndex] ?? ""])
}

/**
 * PDFを変換した形式を読む
 * 12桁のコードが「区分＋前半8桁」と「後半4桁＋品名など」の2列に分かれ、
 * 品名が長い行は次の行へ折り返されているため、1件ずつつなぎ直してから取り出す
 * 例: "内用薬8219001T","1023フェンタニル…帝國製薬先発品1,812.60"
 */
const readPriceFromPdfLayout = (rows: string[][]): [string, string][] => {
  const recordStart = /^(内用薬|注射薬|外用薬|歯科用薬剤?)([0-9A-Z]{8})$/
  // 経過措置の期限（9.3.31まで）や収載日（8.6.12収載）は薬価と取り違えないよう除く
  const dateCell = /^\d+\.\d+\.\d+(まで|収載)?$/
  // 品名などは全角、薬価は半角で書かれているため、末尾の半角の数値を薬価とする
  const priceAtEnd = /(\d{1,3}(?:,\d{3})*\.\d{2})\s*R?\s*$/

  const records: { head: string; cells: string[] }[] = []
  for (const row of rows) {
    const match = recordStart.exec((row[0] ?? "").trim())
    if (match) records.push({ head: match[2], cells: row.slice(1) })
    // 次の件が始まるまでは、折り返された続きの行として扱う
    else if (records.length > 0) records[records.length - 1].cells.push(...row)
  }

  return records.map(({ head, cells }): [string, string] => {
    const texts = cells.map((cell) => cell.trim()).filter((cell) => cell && !dateCell.test(cell))
    const tail = /^([0-9A-Z]{4})/.exec(texts[0] ?? "")?.[1] ?? ""
    const priceCell = texts.slice().reverse().find((cell) => priceAtEnd.test(cell)) ?? ""
    const price = priceAtEnd.exec(priceCell)?.[1] ?? ""
    return [`${head}${tail}`, price]
  })
}

/** price フォルダの全ファイルから、薬価基準収載医薬品コードごとの薬価を読む */
const readPrices = (): PriceReadResult => {
  const dir = path.join(RAW_DIR, PRICE_DIR)
  const result: PriceReadResult = { prices: new Map(), files: [], errors: [], conflicts: 0 }
  if (!existsSync(dir)) return result

  result.files = readdirSync(dir).filter((file) => file.toLowerCase().endsWith(".csv")).sort()

  for (const file of result.files) {
    const rows = readCsv(path.join(PRICE_DIR, file))
    const entries = readPriceWithHeader(rows) ?? readPriceFromPdfLayout(rows)

    for (const [rawCode, rawPrice] of entries) {
      const code = toHalfWidth(rawCode).toUpperCase()
      const price = toPrice(toHalfWidth(rawPrice))
      if (!code && !rawPrice.trim()) continue

      if (!PRICE_CODE_PATTERN.test(code) || price === null) {
        result.errors.push(`${file}: ${rawCode} / ${rawPrice}`)
        continue
      }
      const existing = result.prices.get(code)
      if (existing !== undefined && existing !== price) result.conflicts += 1
      result.prices.set(code, price)
    }
  }
  return result
}

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

  // 除外する販売包装単位コード
  const excludedCodes = new Set<string>(
    existsSync(EXCLUDED_FILE)
      ? (JSON.parse(readFileSync(EXCLUDED_FILE, "utf-8")) as { packages: { gs1SalesCode: string }[] })
          .packages.map((row) => row.gs1SalesCode)
      : []
  )

  const skipped = {
    hotに販売包装コードが無い: 0,
    除外リストの包装: 0,
    YJコードが空または複数: 0,
    供給リストに無いYJコード: 0,
    販売GS1コードの重複: 0,
  }

  // 医薬品はYJコードと販売会社の組み合わせで一意になる（併売・販売移管があるため）
  const drugs = new Map<string, SeedDrug>()
  const usedSalesCodes = new Set<string>()
  // 包装名・内訳・注記の確認用（gitの管理外のCSVに書き出す）
  const packageNameReviewRows: string[][] = []
  const hotRowsByDrug = new Map<string, Record<string, string>[]>()
  let transitionalConflicts = 0
  let categoryConflicts = 0
  // 剤形の判定に使うGS1の剤形（医薬品の最初の包装の値を採る）
  const gs1FormByDrug = new Map<string, string>()

  for (const gs1 of readCsvAsRecords(GS1_FILE)) {
    const salesCode = gs1["販売包装単位コード"]
    if (excludedCodes.has(salesCode)) {
      skipped.除外リストの包装 += 1
      continue
    }
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

    const info = buildPackageInfo(gs1 as unknown as Gs1PackageRow, salesCode)
    packageNameReviewRows.push([
      info.name,
      info.breakdown ?? "",
      info.variant ?? "",
      toHalfWidth(gs1["包装形態"]),
      toHalfWidth(gs1["規格単位"]),
      toHalfWidth(supply[col.name] ?? ""),
      toHalfWidth(hot["販売会社"]),
      salesCode,
    ])

    const pkg: SeedPackage = {
      name: info.name,
      breakdown: info.breakdown,
      variant: info.variant,
      legacyName: info.legacyName,
      gs1SalesCode: salesCode,
      gs1DispensingCode: restoreDispensingCode(gs1["調剤包装単位コード"]),
      hotCode: hot["HOTコード"],
      unifiedCode: toUnifiedCode(salesCode),
      currentShippingStatus: isDiscontinued ? "DISCONTINUED_SALE" : status,
      discontinuedDate,
    }

    const category = toDrugCategory(gs1["区分名"])

    const existing = drugs.get(drugKey)
    if (existing) {
      existing.packages.push(pkg)
      // 区分は医薬品単位の情報。包装間で違う場合は最初の包装の区分を採り、件数を報告する
      if (!existing.category) existing.category = category
      else if (category && category !== existing.category) categoryConflicts += 1
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
        // 薬価はすべての包装を読み終えてから、薬価基準収載医薬品コードで付ける
        price: null,
        productType: toProductType((supply[col.productType] ?? "").trim()),
        category,
        // 剤形はすべての包装を読み終えてから判定する
        dosageForm: null,
        transitionalMeasuresDate: parseCompactDate(gs1["経過措置日"]),
        unit: toHalfWidth(supply[col.unit] ?? ""),
        genericName: toHalfWidth(supply[col.genericName] ?? ""),
        manufacturingCompany: toHalfWidth(hot["製造会社"]),
        salesCompany,
        packages: [pkg],
      })
    }

    if (!gs1FormByDrug.has(drugKey)) gs1FormByDrug.set(drugKey, toHalfWidth(gs1["剤形"]))

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

  // 薬価を薬価基準収載医薬品コードで付ける（同じコードの医薬品には同じ薬価）
  const priceResult = readPrices()
  for (const drug of Array.from(drugs.values())) {
    if (drug.drugPriceListingCode) {
      drug.price = priceResult.prices.get(drug.drugPriceListingCode) ?? null
    }
  }

  // 剤形を判定し、名前で判定したもの・その他になったものを確認用の一覧に出す
  const dosageFormReasons = new Map<string, number>()
  const results = new Map<string, DosageFormResult>()
  for (const [drugKey, drug] of Array.from(drugs)) {
    const result = toDosageForm({ ...drug, gs1Form: gs1FormByDrug.get(drugKey) ?? "" })
    results.set(drugKey, result)
    drug.dosageForm = result.form
  }

  // 併売品などで同じYJコードの剤形が割れた場合は、1つにそろえる
  const drugKeysByYj = new Map<string, string[]>()
  for (const [drugKey, drug] of Array.from(drugs)) {
    drugKeysByYj.set(drug.yjCode, [...(drugKeysByYj.get(drug.yjCode) ?? []), drugKey])
  }
  let unifiedDosageForms = 0
  for (const drugKeys of Array.from(drugKeysByYj.values())) {
    const group = drugKeys.map((drugKey) => {
      const drug = drugs.get(drugKey) as SeedDrug
      return { drugKey, name: drug.name, category: drug.category, form: drug.dosageForm as DosageForm }
    })
    const form = unifyDosageForm(group)
    if (!form) continue
    unifiedDosageForms += 1
    for (const { drugKey, form: before } of group) {
      if (before === form) continue
      ;(drugs.get(drugKey) as SeedDrug).dosageForm = form
      results.set(drugKey, { form, reason: `YJコードでそろえた（元は${before}）`, byName: true })
    }
  }

  const reviewRows: string[][] = []
  for (const [drugKey, drug] of Array.from(drugs)) {
    const result = results.get(drugKey) as DosageFormResult
    const gs1Form = gs1FormByDrug.get(drugKey) ?? ""
    dosageFormReasons.set(result.reason, (dosageFormReasons.get(result.reason) ?? 0) + 1)
    if (result.byName || result.form === "OTHER") {
      reviewRows.push([result.form, result.reason, drug.category ?? "", gs1Form, drug.yjCode, drug.name, drug.salesCompany])
    }
  }
  writeReviewCsv(
    PACKAGE_NAME_REVIEW_FILE,
    ["包装名", "内訳", "注記", "包装形態", "規格単位", "医薬品名", "販売会社", "販売GS1コード"],
    packageNameReviewRows.sort((a, b) => a[5].localeCompare(b[5]) || a[0].localeCompare(b[0]))
  )

  writeReviewCsv(
    DOSAGE_FORM_REVIEW_FILE,
    ["剤形", "判定の根拠", "区分", "GS1の剤形", "YJコード", "医薬品名", "販売会社"],
    reviewRows.sort((a, b) => a[0].localeCompare(b[0]) || a[5].localeCompare(b[5]))
  )

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
  const unifiedCodes = drugList.flatMap((d) => d.packages.map((p) => p.unifiedCode))
  const unifiedCodeCount = unifiedCodes.filter(Boolean).length
  const unifiedCodeDuplicates = unifiedCodeCount - new Set(unifiedCodes.filter(Boolean)).size
  const pricedCount = drugList.filter((d) => d.price !== null).length
  const categoryCounts = drugList.reduce<Record<string, number>>((counts, d) => {
    const key = d.category ?? "なし"
    counts[key] = (counts[key] ?? 0) + 1
    return counts
  }, {})
  const payload = {
    generatedAt: new Date().toISOString(),
    source: [SUPPLY_FILE, HOT_FILE, GS1_FILE, ...priceResult.files.map((file) => `${PRICE_DIR}/${file}`)],
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
  console.log(`  統一商品コードあり     : ${unifiedCodeCount.toLocaleString()}（重複 ${unifiedCodeDuplicates}）`)
  console.log(`  薬価あり               : ${pricedCount.toLocaleString()}`)
  console.log(
    `  区分                   : ${Object.entries(categoryCounts)
      .map(([key, count]) => `${key} ${count.toLocaleString()}`)
      .join(" / ")}`
  )
  console.log(`  区分が包装間で不一致   : ${categoryConflicts.toLocaleString()}`)

  const allPackages = drugList.flatMap((drug) => drug.packages)
  const withBreakdown = allPackages.filter((pkg) => pkg.breakdown).length
  const withVariant = allPackages.filter((pkg) => pkg.variant).length
  // 同じ医薬品内で包装名が重複している包装（タグに注記を出す対象）
  const duplicatedNames = drugList.reduce((total, drug) => {
    const counts = new Map<string, number>()
    drug.packages.forEach((pkg) => counts.set(pkg.name, (counts.get(pkg.name) ?? 0) + 1))
    return total + drug.packages.filter((pkg) => (counts.get(pkg.name) ?? 0) > 1).length
  }, 0)
  const leftoverOverrides = unusedOverrides(usedSalesCodes)

  console.log("\n--- 包装名")
  console.log(`  内訳あり               : ${withBreakdown.toLocaleString()}`)
  console.log(`  注記あり               : ${withVariant.toLocaleString()}`)
  console.log(`  包装名が重複            : ${duplicatedNames.toLocaleString()}（うち注記あり ${drugList
    .flatMap((drug) => {
      const counts = new Map<string, number>()
      drug.packages.forEach((pkg) => counts.set(pkg.name, (counts.get(pkg.name) ?? 0) + 1))
      return drug.packages.filter((pkg) => (counts.get(pkg.name) ?? 0) > 1 && pkg.variant)
    })
    .length.toLocaleString()}）`)
  if (leftoverOverrides.length > 0) {
    console.log(`  手直しの指定が未使用     : ${leftoverOverrides.join(", ")}`)
  }
  console.log(`  確認用の一覧: ${path.relative(process.cwd(), PACKAGE_NAME_REVIEW_FILE)}（${packageNameReviewRows.length.toLocaleString()}件）`)

  const dosageFormCounts = drugList.reduce<Record<string, number>>((counts, d) => {
    const key = d.dosageForm ?? "なし"
    counts[key] = (counts[key] ?? 0) + 1
    return counts
  }, {})
  console.log("\n--- 剤形")
  Object.entries(dosageFormCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([form, count]) => console.log(`  ${form.padEnd(17)}: ${count.toLocaleString()}`))
  console.log("  判定の根拠:")
  Array.from(dosageFormReasons)
    .sort((a, b) => b[1] - a[1])
    .forEach(([reason, count]) => console.log(`    ${reason}: ${count.toLocaleString()}`))
  console.log(`  同じYJコードでそろえた製品: ${unifiedDosageForms.toLocaleString()}`)
  console.log(`  確認用の一覧: ${path.relative(process.cwd(), DOSAGE_FORM_REVIEW_FILE)}（${reviewRows.length.toLocaleString()}件）`)

  console.log("\n--- 薬価の読み込み")
  if (priceResult.files.length === 0) {
    console.log(`  ${PRICE_DIR}/ にファイルが無いため、薬価は空で生成しました`)
  } else {
    console.log(`  ファイル          : ${priceResult.files.join(", ")}`)
    console.log(`  読み込んだコード  : ${priceResult.prices.size.toLocaleString()}`)
    console.log(`  取り出せなかった行: ${priceResult.errors.length.toLocaleString()}`)
    priceResult.errors.slice(0, 5).forEach((error) => console.log(`    ${error}`))
    console.log(`  同じコードで薬価が違う: ${priceResult.conflicts.toLocaleString()}`)
  }
  console.log(
    `\n  ${path.relative(process.cwd(), OUT_FILE)} ` +
      `(${(gzipSync(json, { level: 9 }).length / 1024 / 1024).toFixed(1)}MB, ` +
      `元 ${(json.length / 1024 / 1024).toFixed(1)}MB)`
  )
  console.log(`  sha256: ${createHash("sha256").update(json).digest("hex").slice(0, 16)}`)
}

main()
