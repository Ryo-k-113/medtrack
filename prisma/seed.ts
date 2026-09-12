/**
 * prisma/seed/seed-data.json.gz をDBへ投入する
 *
 * 実行
 *   npm run seed -- --limit 200   件数を絞って投入（段階投入の1段目）
 *   npm run seed                  全件投入
 *
 * 何度実行しても重複しない。既に同じキーで登録済みの行は作成をスキップする
 * （更新はしないため、元データを変え直して反映したい場合は対象行を消してから実行する）
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { gunzipSync } from "node:zlib"

import { PrismaClient, type ProductType, type CurrentShippingStatus } from "@prisma/client"

const prisma = new PrismaClient()

const DATA_FILE = path.join(process.cwd(), "prisma/seed/seed-data.json.gz")
// createMany 1回あたりの件数。接続の上限に当たらない程度に分割する
const CHUNK_SIZE = 1000

type SeedPackage = {
  name: string
  gs1SalesCode: string
  gs1DispensingCode: string | null
  hotCode: string
  currentShippingStatus: CurrentShippingStatus
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

type SeedData = {
  generatedAt: string
  units: string[]
  genericNames: string[]
  companies: string[]
  drugs: SeedDrug[]
}

const chunk = <T>(items: T[], size: number): T[][] => {
  const result: T[][] = []
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size))
  return result
}

/** --limit の値を読む。指定が無ければ全件 */
const parseLimit = (): number | null => {
  const index = process.argv.indexOf("--limit")
  if (index === -1) return null
  const value = Number(process.argv[index + 1])
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error("--limit には1以上の整数を指定してください")
  }
  return value
}

/**
 * 件数を絞るときは、製品区分と出荷状況が偏らないように選ぶ。
 * 先頭から取ると通常出荷の先発品ばかりになり、画面の確認に使えないため
 */
const selectDrugs = (drugs: SeedDrug[], limit: number | null): SeedDrug[] => {
  if (limit === null || limit >= drugs.length) return drugs

  const buckets = new Map<string, SeedDrug[]>()
  for (const drug of drugs) {
    const key = `${drug.productType}:${drug.packages[0].currentShippingStatus}`
    const bucket = buckets.get(key)
    if (bucket) bucket.push(drug)
    else buckets.set(key, [drug])
  }

  const selected: SeedDrug[] = []
  const lists = Array.from(buckets.values())
  for (let i = 0; selected.length < limit; i += 1) {
    const before = selected.length
    for (const list of lists) {
      if (selected.length >= limit) break
      if (i < list.length) selected.push(list[i])
    }
    // どのバケットも尽きた
    if (selected.length === before) break
  }
  return selected
}

/** 名前だけのマスタを登録し、名前からIDを引ける表を返す */
const seedMaster = async (
  label: string,
  names: string[],
  create: (rows: { name: string }[]) => Promise<unknown>,
  findAll: () => Promise<{ id: number; name: string }[]>
): Promise<Map<string, number>> => {
  for (const rows of chunk(names, CHUNK_SIZE)) {
    await create(rows.map((name) => ({ name })))
  }
  const all = await findAll()
  const map = new Map(all.map((row) => [row.name, row.id]))
  const missing = names.filter((name) => !map.has(name))
  if (missing.length > 0) {
    throw new Error(`${label}: 登録できなかった名前があります (${missing.slice(0, 3).join(", ")})`)
  }
  console.log(`  ${label}: ${names.length.toLocaleString()}件`)
  return map
}

const main = async () => {
  const limit = parseLimit()
  const data: SeedData = JSON.parse(gunzipSync(readFileSync(DATA_FILE)).toString("utf-8"))
  const drugs = selectDrugs(data.drugs, limit)
  const packageCount = drugs.reduce((sum, drug) => sum + drug.packages.length, 0)

  console.log(`元データ生成日時: ${data.generatedAt}`)
  console.log(
    limit === null
      ? `投入対象: 全件（医薬品 ${drugs.length.toLocaleString()}件 / 包装 ${packageCount.toLocaleString()}件）`
      : `投入対象: --limit ${limit}（医薬品 ${drugs.length.toLocaleString()}件 / 包装 ${packageCount.toLocaleString()}件）`
  )

  // 投入する医薬品が使うマスタだけを登録する
  const units = Array.from(new Set(drugs.map((d) => d.unit)))
  const genericNames = Array.from(new Set(drugs.map((d) => d.genericName)))
  const companies = Array.from(
    new Set(drugs.flatMap((d) => [d.manufacturingCompany, d.salesCompany]))
  )

  console.log("\nマスタを登録")
  const unitMap = await seedMaster(
    "規格単位",
    units,
    (rows) => prisma.unit.createMany({ data: rows, skipDuplicates: true }),
    () => prisma.unit.findMany({ select: { id: true, name: true } })
  )
  const genericNameMap = await seedMaster(
    "成分名",
    genericNames,
    (rows) => prisma.genericName.createMany({ data: rows, skipDuplicates: true }),
    () => prisma.genericName.findMany({ select: { id: true, name: true } })
  )
  const companyMap = await seedMaster(
    "製薬会社",
    companies,
    (rows) => prisma.pharmaceuticalCompany.createMany({ data: rows, skipDuplicates: true }),
    () => prisma.pharmaceuticalCompany.findMany({ select: { id: true, name: true } })
  )

  console.log("\n医薬品を登録")
  const drugRows = drugs.map((drug) => ({
    name: drug.name,
    yjCode: drug.yjCode,
    drugPriceListingCode: drug.drugPriceListingCode,
    productType: drug.productType,
    transitionalMeasuresDate: drug.transitionalMeasuresDate
      ? new Date(drug.transitionalMeasuresDate)
      : null,
    unitId: unitMap.get(drug.unit)!,
    genericNameId: genericNameMap.get(drug.genericName)!,
    manufacturingCompanyId: companyMap.get(drug.manufacturingCompany)!,
    salesCompanyId: companyMap.get(drug.salesCompany)!,
  }))
  let done = 0
  for (const rows of chunk(drugRows, CHUNK_SIZE)) {
    await prisma.drug.createMany({ data: rows, skipDuplicates: true })
    done += rows.length
    process.stdout.write(`\r  ${done.toLocaleString()} / ${drugRows.length.toLocaleString()}`)
  }
  console.log("")

  // 包装の登録には医薬品のIDが必要なので、YJコードと販売会社の組み合わせで引き直す。
  // YJコードが万件になるとIN句が膨らむため分割して引く
  const drugIdMap = new Map<string, number>()
  for (const yjCodes of chunk(Array.from(new Set(drugs.map((d) => d.yjCode))), CHUNK_SIZE)) {
    const saved = await prisma.drug.findMany({
      where: { yjCode: { in: yjCodes } },
      select: { id: true, yjCode: true, salesCompanyId: true },
    })
    for (const row of saved) {
      drugIdMap.set(`${row.yjCode} ${row.salesCompanyId}`, row.id)
    }
  }

  console.log("\n包装を登録")
  const packageRows = drugs.flatMap((drug) => {
    const drugId = drugIdMap.get(`${drug.yjCode} ${companyMap.get(drug.salesCompany)}`)
    if (drugId === undefined) {
      throw new Error(`医薬品のIDが引けません (YJ=${drug.yjCode} 販売=${drug.salesCompany})`)
    }
    return drug.packages.map((pkg) => ({
      name: pkg.name,
      gs1SalesCode: pkg.gs1SalesCode,
      gs1DispensingCode: pkg.gs1DispensingCode,
      hotCode: pkg.hotCode,
      currentShippingStatus: pkg.currentShippingStatus,
      discontinuedDate: pkg.discontinuedDate ? new Date(pkg.discontinuedDate) : null,
      publishStatus: "PUBLISHED" as const,
      drugId,
    }))
  })
  done = 0
  for (const rows of chunk(packageRows, CHUNK_SIZE)) {
    await prisma.packageUnit.createMany({ data: rows, skipDuplicates: true })
    done += rows.length
    process.stdout.write(`\r  ${done.toLocaleString()} / ${packageRows.length.toLocaleString()}`)
  }
  console.log("")

  const [unitCount, genericNameCount, companyCount, drugCount, pkgCount] = await Promise.all([
    prisma.unit.count(),
    prisma.genericName.count(),
    prisma.pharmaceuticalCompany.count(),
    prisma.drug.count(),
    prisma.packageUnit.count(),
  ])
  console.log("\n投入後のDBの件数")
  console.log(`  規格単位: ${unitCount.toLocaleString()}`)
  console.log(`  成分名  : ${genericNameCount.toLocaleString()}`)
  console.log(`  製薬会社: ${companyCount.toLocaleString()}`)
  console.log(`  医薬品  : ${drugCount.toLocaleString()}`)
  console.log(`  包装    : ${pkgCount.toLocaleString()}`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
