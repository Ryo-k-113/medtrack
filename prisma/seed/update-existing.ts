/**
 * 投入済みのDBに、シードデータで追加した項目を反映する
 * seed.ts は既存の行を読み飛ばすため、後から追加した項目はこのスクリプトで埋める
 *
 * 反映する項目と条件
 *   包装名          旧規則（包装形態＋総数＋単位）で作った名前のままの包装のみ
 *                   （管理画面で手直しした名前は上書きしない）
 *   内訳・注記      空欄の包装のみ
 *   統一商品コード  空欄の包装のみ（管理画面で入力した値は上書きしない）
 *   薬価            公式の値で上書き（薬価基準収載医薬品コードで突き合わせる）
 *   区分・剤形      空欄の医薬品のみ（YJコードで突き合わせる）
 *
 * 実行
 *   npm run seed:update              確認のみ（DBは変更しない）
 *   npm run seed:update -- --apply   反映する
 *
 * 接続先は DATABASE_URL。本番に反映する場合は、実行時だけ本番の値を指定する
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { gunzipSync } from "node:zlib"

import {
  Prisma,
  PrismaClient,
  type DosageForm,
  type DrugCategory,
} from "@prisma/client"

import { writeReviewCsv } from "./review-csv"

const prisma = new PrismaClient()

const DATA_FILE = path.join(process.cwd(), "prisma/seed/seed-data.json.gz")
const REPORT_FILE = path.join(process.cwd(), "prisma/seed/raw/match/既存データの更新.csv")

/** 1回のUPDATEで渡す行数（PostgreSQLのパラメータ上限に対して十分小さくする） */
const UPDATE_CHUNK_SIZE = 3000
/** 全件の更新が終わるまでトランザクションを保つ時間（ミリ秒） */
const TRANSACTION_TIMEOUT_MS = 300000
/** 画面に出す例の件数 */
const EXAMPLE_COUNT = 5

type SeedData = {
  generatedAt: string
  drugs: {
    name: string
    yjCode: string
    drugPriceListingCode: string | null
    price: number | null
    category: DrugCategory | null
    dosageForm: DosageForm | null
    packages: {
      gs1SalesCode: string
      name: string
      breakdown: string | null
      variant: string | null
      unifiedCode: string | null
      /** 旧規則で作った包装名（上書きしてよいかの判定に使う） */
      legacyName: string
    }[]
  }[]
}

/** 報告用の一覧の1行 */
type ReportRow = { item: string; status: string; target: string; current: string; seed: string }

const chunk = <T>(items: T[], size: number): T[][] => {
  const result: T[][] = []
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size))
  return result
}

/**
 * 接続先のSupabaseプロジェクトIDを取り出す（開発と本番を取り違えないよう最初に表示する）
 * プーラー経由の接続では、ユーザー名が「postgres.プロジェクトID」の形になる
 */
const describeTarget = (): string => {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL が設定されていません")
  const { username, hostname } = new URL(url)
  const projectRef = username.split(".")[1] ?? "(不明)"
  return `${projectRef}（${hostname}）`
}

/** 反映に必要な列がDBにあるかを確かめる（マイグレーション未適用のDBでは止める） */
const assertColumnsExist = async () => {
  const required = [
    ["drugs", "category"],
    ["drugs", "dosage_form"],
    ["drugs", "price"],
    ["package_units", "unified_code"],
    ["package_units", "breakdown"],
    ["package_units", "variant"],
  ]
  const rows = await prisma.$queryRaw<{ table_name: string; column_name: string }[]>`
    SELECT table_name, column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name IN ('drugs', 'package_units')`
  const existing = new Set(rows.map((row) => `${row.table_name}.${row.column_name}`))
  const missing = required.filter(([table, column]) => !existing.has(`${table}.${column}`))
  if (missing.length > 0) {
    throw new Error(
      `列が見つかりません: ${missing.map(([t, c]) => `${t}.${c}`).join(", ")}\n` +
        "マイグレーションが未適用です。本番の場合は、先にデプロイしてマイグレーションを適用してください"
    )
  }
}

/** 数値の薬価を比較用の文字列にする（Decimalとnumberの表記の違いをそろえる） */
const priceText = (value: Prisma.Decimal | number | null): string =>
  value === null ? "" : new Prisma.Decimal(value).toString()

const main = async () => {
  const isApply = process.argv.includes("--apply")
  const data: SeedData = JSON.parse(gunzipSync(readFileSync(DATA_FILE)).toString("utf-8"))

  console.log(`接続先      : ${describeTarget()}`)
  console.log(`実行モード  : ${isApply ? "反映する（--apply）" : "確認のみ（DBは変更しない）"}`)
  console.log(`シードデータ: ${data.generatedAt} に生成\n`)

  await assertColumnsExist()

  // ------------------------------------------------ シードデータから、突き合わせの表を作る
  const unifiedByGs1 = new Map<string, string>()
  const packageByGs1 = new Map<string, SeedData["drugs"][number]["packages"][number]>()
  const priceByCode = new Map<string, number>()
  const formByYj = new Map<string, { category: DrugCategory | null; dosageForm: DosageForm | null }>()
  let yjConflicts = 0

  for (const drug of data.drugs) {
    for (const pkg of drug.packages) {
      if (pkg.unifiedCode) unifiedByGs1.set(pkg.gs1SalesCode, pkg.unifiedCode)
      packageByGs1.set(pkg.gs1SalesCode, pkg)
    }
    if (drug.drugPriceListingCode && drug.price !== null) {
      priceByCode.set(drug.drugPriceListingCode, drug.price)
    }
    // 区分・剤形は製品（YJコード）で決まる。併売で同じYJコードが複数あっても同じ値になる
    const existing = formByYj.get(drug.yjCode)
    if (
      existing &&
      (existing.category !== drug.category || existing.dosageForm !== drug.dosageForm)
    ) {
      yjConflicts += 1
    }
    if (!existing) formByYj.set(drug.yjCode, { category: drug.category, dosageForm: drug.dosageForm })
  }

  const report: ReportRow[] = []

  // ------------------------------------------------ DBの現在の値を読む
  const [packages, drugs] = await Promise.all([
    prisma.packageUnit.findMany({
      select: {
        id: true,
        name: true,
        breakdown: true,
        variant: true,
        gs1SalesCode: true,
        unifiedCode: true,
        Drug: { select: { name: true } },
      },
      orderBy: { id: "asc" },
    }),
    prisma.drug.findMany({
      select: {
        id: true,
        name: true,
        yjCode: true,
        drugPriceListingCode: true,
        price: true,
        category: true,
        dosageForm: true,
      },
      orderBy: { id: "asc" },
    }),
  ])

  // ------------------------------------------------ 包装名・内訳・注記
  const packageUpdates: {
    id: number
    name: string | null
    breakdown: string | null
    variant: string | null
  }[] = []
  const nameStats = { 変わる: 0, 同じ値: 0, 手直し済みで残す: 0, シードに無い: 0 }
  const detailStats = { 内訳を埋める: 0, 注記を埋める: 0, 入力済みで異なる: 0 }

  for (const pkg of packages) {
    const seed = packageByGs1.get(pkg.gs1SalesCode)
    const target = `${pkg.Drug.name} ${pkg.name}（${pkg.gs1SalesCode}）`
    if (!seed) {
      nameStats.シードに無い += 1
      continue
    }

    // 包装名は、DBの値が旧規則で作った名前のままのときだけ差し替える
    let name: string | null = null
    if (pkg.name === seed.name) {
      nameStats.同じ値 += 1
    } else if (pkg.name === seed.legacyName) {
      nameStats.変わる += 1
      name = seed.name
    } else {
      nameStats.手直し済みで残す += 1
      report.push({ item: "包装名", status: "手直し済み（更新しない）", target, current: pkg.name, seed: seed.name })
    }

    // 内訳・注記は空欄のときだけ埋める
    const breakdown = pkg.breakdown === null && seed.breakdown !== null ? seed.breakdown : null
    const variant = pkg.variant === null && seed.variant !== null ? seed.variant : null
    if (breakdown) detailStats.内訳を埋める += 1
    if (variant) detailStats.注記を埋める += 1
    if (pkg.breakdown && seed.breakdown && pkg.breakdown !== seed.breakdown) {
      detailStats.入力済みで異なる += 1
      report.push({ item: "内訳", status: "入力済みで異なる（更新しない）", target, current: pkg.breakdown, seed: seed.breakdown })
    }
    if (pkg.variant && seed.variant && pkg.variant !== seed.variant) {
      detailStats.入力済みで異なる += 1
      report.push({ item: "注記", status: "入力済みで異なる（更新しない）", target, current: pkg.variant, seed: seed.variant })
    }

    if (name || breakdown || variant) packageUpdates.push({ id: pkg.id, name, breakdown, variant })
  }

  // ------------------------------------------------ 統一商品コード
  // 一意制約があるため、ほかの包装がすでに使っている値は埋めない
  const packageIdByUnified = new Map(
    packages.filter((pkg) => pkg.unifiedCode).map((pkg) => [pkg.unifiedCode as string, pkg.id])
  )
  const unifiedUpdates: { id: number; unifiedCode: string }[] = []
  const unifiedStats = { 埋める: 0, 同じ値: 0, 入力済みで異なる: 0, ほかの包装が使用中: 0, シードに無い: 0 }

  for (const pkg of packages) {
    const seedValue = unifiedByGs1.get(pkg.gs1SalesCode)
    const target = `${pkg.Drug.name} ${pkg.name}（${pkg.gs1SalesCode}）`

    if (!seedValue) {
      unifiedStats.シードに無い += 1
    } else if (pkg.unifiedCode === seedValue) {
      unifiedStats.同じ値 += 1
    } else if (pkg.unifiedCode) {
      unifiedStats.入力済みで異なる += 1
      report.push({ item: "統一商品コード", status: "入力済みで異なる（更新しない）", target, current: pkg.unifiedCode, seed: seedValue })
    } else if (packageIdByUnified.has(seedValue)) {
      unifiedStats.ほかの包装が使用中 += 1
      report.push({ item: "統一商品コード", status: "ほかの包装が使用中（更新しない）", target, current: "", seed: seedValue })
    } else {
      unifiedStats.埋める += 1
      unifiedUpdates.push({ id: pkg.id, unifiedCode: seedValue })
    }
  }

  // ------------------------------------------------ 薬価
  const priceUpdates: { id: number; price: number }[] = []
  const priceStats = { 新しく入る: 0, 変わる: 0, 同じ値: 0, 薬価のファイルに無い: 0, コードなし: 0 }

  for (const drug of drugs) {
    if (!drug.drugPriceListingCode) {
      priceStats.コードなし += 1
      continue
    }
    const seedPrice = priceByCode.get(drug.drugPriceListingCode)
    if (seedPrice === undefined) {
      priceStats.薬価のファイルに無い += 1
    } else if (priceText(drug.price) === priceText(seedPrice)) {
      priceStats.同じ値 += 1
    } else {
      if (drug.price === null) priceStats.新しく入る += 1
      else {
        priceStats.変わる += 1
        report.push({ item: "薬価", status: "変わる（上書きする）", target: drug.name, current: priceText(drug.price), seed: priceText(seedPrice) })
      }
      priceUpdates.push({ id: drug.id, price: seedPrice })
    }
  }

  // ------------------------------------------------ 区分・剤形
  const formUpdates: { id: number; category: DrugCategory | null; dosageForm: DosageForm | null }[] = []
  const formStats = { 埋める: 0, 入力済み: 0, 入力済みで異なる: 0, シードに無い: 0 }

  for (const drug of drugs) {
    const seedForm = formByYj.get(drug.yjCode)
    if (!seedForm) {
      formStats.シードに無い += 1
      continue
    }
    const fillCategory = drug.category === null && seedForm.category !== null
    const fillDosageForm = drug.dosageForm === null && seedForm.dosageForm !== null

    if (drug.category && drug.category !== seedForm.category) {
      formStats.入力済みで異なる += 1
      report.push({ item: "区分", status: "入力済みで異なる（更新しない）", target: drug.name, current: drug.category, seed: seedForm.category ?? "" })
    }
    if (drug.dosageForm && drug.dosageForm !== seedForm.dosageForm) {
      formStats.入力済みで異なる += 1
      report.push({ item: "剤形", status: "入力済みで異なる（更新しない）", target: drug.name, current: drug.dosageForm, seed: seedForm.dosageForm ?? "" })
    }

    if (fillCategory || fillDosageForm) {
      formStats.埋める += 1
      formUpdates.push({
        id: drug.id,
        category: fillCategory ? seedForm.category : null,
        dosageForm: fillDosageForm ? seedForm.dosageForm : null,
      })
    } else {
      formStats.入力済み += 1
    }
  }

  // ------------------------------------------------ 報告
  const printStats = (title: string, stats: Record<string, number>) => {
    console.log(`■ ${title}`)
    Object.entries(stats).forEach(([label, count]) => console.log(`  ${label}: ${count.toLocaleString()}`))
  }
  console.log(`DB: 包装 ${packages.length.toLocaleString()}件 / 医薬品 ${drugs.length.toLocaleString()}件\n`)
  printStats("包装名（包装）", nameStats)
  printStats("内訳・注記（包装）", detailStats)
  printStats("統一商品コード（包装）", unifiedStats)
  printStats("薬価（医薬品）", priceStats)
  printStats("区分・剤形（医薬品）", formStats)
  if (yjConflicts > 0) console.log(`  ※同じYJコードで区分・剤形が異なるシードの行: ${yjConflicts}（最初の行を採用）`)

  if (report.length > 0) {
    console.log(`\n確認が必要な行（例）`)
    report.slice(0, EXAMPLE_COUNT).forEach((row) =>
      console.log(`  [${row.item}] ${row.status} ${row.target}: ${row.current || "空欄"} → ${row.seed || "空欄"}`)
    )
  }
  writeReviewCsv(
    REPORT_FILE,
    ["項目", "判定", "対象", "DBの値", "シードの値"],
    report.map((row) => [row.item, row.status, row.target, row.current, row.seed])
  )
  console.log(`\n確認用の一覧: ${path.relative(process.cwd(), REPORT_FILE)}（${report.length.toLocaleString()}件）`)

  if (!isApply) {
    console.log("\n確認のみのため、DBは変更していません。反映するには --apply を付けて実行してください")
    return
  }

  // ------------------------------------------------ 反映（途中で失敗した場合は全件を元に戻す）
  // 読み取りから反映までの間に管理画面で入力された値を上書きしないよう、UPDATEの条件でも空欄を確かめる
  const updated = await prisma.$transaction(
    async (tx) => {
      let packageCount = 0
      for (const rows of chunk(packageUpdates, UPDATE_CHUNK_SIZE)) {
        const values = rows.map(
          (row) => Prisma.sql`(${row.id}::int, ${row.name}::text, ${row.breakdown}::text, ${row.variant}::text)`
        )
        // 名前は指定があるときだけ差し替え、内訳・注記は空欄のときだけ埋める
        packageCount += await tx.$executeRaw`
          UPDATE package_units AS p
          SET name = COALESCE(v.name, p.name),
              breakdown = COALESCE(p.breakdown, v.breakdown),
              variant = COALESCE(p.variant, v.variant),
              updated_at = NOW()
          FROM (VALUES ${Prisma.join(values)}) AS v(id, name, breakdown, variant)
          WHERE p.id = v.id
            AND (
              (v.name IS NOT NULL AND p.name IS DISTINCT FROM v.name)
              OR (v.breakdown IS NOT NULL AND p.breakdown IS NULL)
              OR (v.variant IS NOT NULL AND p.variant IS NULL)
            )`
      }

      let unifiedCount = 0
      for (const rows of chunk(unifiedUpdates, UPDATE_CHUNK_SIZE)) {
        const values = rows.map((row) => Prisma.sql`(${row.id}::int, ${row.unifiedCode}::text)`)
        unifiedCount += await tx.$executeRaw`
          UPDATE package_units AS p
          SET unified_code = v.unified_code, updated_at = NOW()
          FROM (VALUES ${Prisma.join(values)}) AS v(id, unified_code)
          WHERE p.id = v.id AND p.unified_code IS NULL`
      }

      let priceCount = 0
      for (const rows of chunk(priceUpdates, UPDATE_CHUNK_SIZE)) {
        // 浮動小数点の誤差が入らないよう、薬価は文字列で渡してnumericへ変換する
        const values = rows.map((row) => Prisma.sql`(${row.id}::int, ${String(row.price)}::numeric)`)
        priceCount += await tx.$executeRaw`
          UPDATE drugs AS d
          SET price = v.price, updated_at = NOW()
          FROM (VALUES ${Prisma.join(values)}) AS v(id, price)
          WHERE d.id = v.id AND d.price IS DISTINCT FROM v.price`
      }

      let formCount = 0
      for (const rows of chunk(formUpdates, UPDATE_CHUNK_SIZE)) {
        const values = rows.map(
          (row) => Prisma.sql`(${row.id}::int, ${row.category}::drug_category, ${row.dosageForm}::dosage_form)`
        )
        formCount += await tx.$executeRaw`
          UPDATE drugs AS d
          SET category = COALESCE(d.category, v.category),
              dosage_form = COALESCE(d.dosage_form, v.dosage_form),
              updated_at = NOW()
          FROM (VALUES ${Prisma.join(values)}) AS v(id, category, dosage_form)
          WHERE d.id = v.id AND (d.category IS NULL OR d.dosage_form IS NULL)`
      }

      return { packageCount, unifiedCount, priceCount, formCount }
    },
    { timeout: TRANSACTION_TIMEOUT_MS, maxWait: 10000 }
  )

  console.log("\n反映しました")
  console.log(`  包装名・内訳・注記: ${updated.packageCount.toLocaleString()}件`)
  console.log(`  統一商品コード: ${updated.unifiedCount.toLocaleString()}件`)
  console.log(`  薬価          : ${updated.priceCount.toLocaleString()}件`)
  console.log(`  区分・剤形    : ${updated.formCount.toLocaleString()}件`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error instanceof Error ? error.message : error)
    await prisma.$disconnect()
    process.exit(1)
  })
