/**
 * prisma/seed/excluded-packages.json に挙げた包装をDBから削除する
 * 包装が0件になった医薬品も、設定に応じて削除する
 *
 * 削除の直前に、削除する内容（医薬品・包装・告知・ブックマーク）を控えとして書き出す
 * 控えからは restore-deleted.ts で元のIDのまま戻せる
 *
 * 実行
 *   npm run seed:delete                     確認のみ（DBは変更しない）
 *   npm run seed:delete -- --apply          削除する
 *   npm run seed:delete -- 別のファイル.json  対象の指定を差し替える
 *
 * 接続先は DATABASE_URL。本番に対して実行する場合は、実行時だけ本番の値を指定する
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import path from "node:path"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

/** 削除する包装の指定（コマンドでファイルを指定できる。既定は excluded-packages.json） */
const targetArg = process.argv.slice(2).find((arg) => arg.endsWith(".json"))
const TARGET_FILE = targetArg
  ? path.resolve(targetArg)
  : path.join(process.cwd(), "prisma/seed/excluded-packages.json")
const BACKUP_DIR = path.join(process.cwd(), "prisma/seed/raw/match")

/** 削除する包装の指定 */
type TargetFile = {
  reason: string
  decidedAt: string
  /** 包装が0件になった医薬品も削除するか */
  deleteEmptyDrugs: boolean
  packages: {
    gs1SalesCode: string
    salesCompany: string
    drugName: string
    packageName: string
  }[]
}

/** 接続先のSupabaseプロジェクトID（開発と本番を取り違えないよう最初に表示する） */
const describeTarget = (): string => {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL が設定されていません")
  const { username, hostname } = new URL(url)
  return `${username.split(".")[1] ?? "(不明)"}（${hostname}）`
}

const main = async () => {
  const isApply = process.argv.includes("--apply")
  const target: TargetFile = JSON.parse(readFileSync(TARGET_FILE, "utf-8"))
  const codes = target.packages.map((row) => row.gs1SalesCode)

  console.log(`接続先      : ${describeTarget()}`)
  console.log(`実行モード  : ${isApply ? "削除する（--apply）" : "確認のみ（DBは変更しない）"}`)
  console.log(`対象の指定  : ${path.relative(process.cwd(), TARGET_FILE)}（${codes.length}件）`)
  console.log(`理由        : ${target.reason}\n`)

  // 削除する包装と、その告知
  const packages = await prisma.packageUnit.findMany({
    where: { gs1SalesCode: { in: codes } },
    include: {
      shippingAnnouncements: true,
      Drug: { select: { id: true, name: true, SalesCompany: { select: { name: true } } } },
    },
    orderBy: { id: "asc" },
  })
  const missing = codes.filter((code) => !packages.some((pkg) => pkg.gs1SalesCode === code))

  // 削除後に包装が0件になる医薬品
  const drugIds = Array.from(new Set(packages.map((pkg) => pkg.drugId)))
  const remaining = await prisma.packageUnit.groupBy({
    by: ["drugId"],
    where: { drugId: { in: drugIds }, gs1SalesCode: { notIn: codes } },
    _count: { _all: true },
  })
  const keptDrugIds = new Set(remaining.map((row) => row.drugId))
  const emptyDrugIds = drugIds.filter((id) => !keptDrugIds.has(id))

  // 医薬品を削除するとブックマークも消えるため、件数を確かめる
  const bookmarks = await prisma.bookmarkDrug.findMany({
    where: { drugId: { in: target.deleteEmptyDrugs ? emptyDrugIds : [] } },
    orderBy: { id: "asc" },
  })
  const announcementCount = packages.reduce((sum, pkg) => sum + pkg.shippingAnnouncements.length, 0)

  console.log("■ 削除の対象")
  console.log(`  包装          : ${packages.length}件（指定のうちDBに無い: ${missing.length}件）`)
  console.log(`  告知          : ${announcementCount}件（包装と一緒に削除される）`)
  console.log(
    `  包装が0件になる医薬品: ${emptyDrugIds.length}件` +
      (target.deleteEmptyDrugs ? "（削除する）" : "（削除しない）")
  )
  console.log(`  ブックマーク  : ${bookmarks.length}件（医薬品と一緒に削除される）`)

  if (missing.length > 0) {
    console.log(`\n  DBに無い販売GS1コード: ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? " …" : ""}`)
  }

  const emptyDrugs = packages
    .filter((pkg) => emptyDrugIds.includes(pkg.drugId))
    .map((pkg) => `${pkg.Drug.name}［${pkg.Drug.SalesCompany.name}］`)
  if (emptyDrugs.length > 0) {
    console.log("\n■ 包装が0件になる医薬品")
    Array.from(new Set(emptyDrugs)).forEach((name) => console.log(`  ${name}`))
  }

  if (packages.length === 0) {
    console.log("\n削除する包装がありません")
    return
  }

  if (!isApply) {
    console.log("\n確認のみのため、DBは変更していません。削除するには --apply を付けて実行してください")
    return
  }

  // 削除の直前に控えを書き出す（元のIDのまま戻せるよう、IDを含めて保存する）
  const drugsToDelete = target.deleteEmptyDrugs
    ? await prisma.drug.findMany({ where: { id: { in: emptyDrugIds } }, orderBy: { id: "asc" } })
    : []
  const backup = {
    deletedAt: new Date().toISOString(),
    reason: target.reason,
    drugs: drugsToDelete,
    packages: packages.map(({ Drug: _drug, shippingAnnouncements: _announcements, ...pkg }) => pkg),
    shippingAnnouncements: packages.flatMap((pkg) => pkg.shippingAnnouncements),
    bookmarkDrugs: bookmarks,
  }
  const backupFile = path.join(
    BACKUP_DIR,
    `削除の控え_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "")}.json`
  )
  mkdirSync(BACKUP_DIR, { recursive: true })
  writeFileSync(backupFile, JSON.stringify(backup, null, 2))
  console.log(`\n控えを書き出しました: ${path.relative(process.cwd(), backupFile)}`)

  // 途中で失敗した場合は、削除を全て取り消す
  const result = await prisma.$transaction(async (tx) => {
    // 告知とブックマークは、包装・医薬品の削除に連動して消える
    const deletedPackages = await tx.packageUnit.deleteMany({ where: { gs1SalesCode: { in: codes } } })
    const deletedDrugs = target.deleteEmptyDrugs
      ? await tx.drug.deleteMany({ where: { id: { in: emptyDrugIds } } })
      : { count: 0 }
    return { deletedPackages: deletedPackages.count, deletedDrugs: deletedDrugs.count }
  })

  console.log("\n削除しました")
  console.log(`  包装      : ${result.deletedPackages}件`)
  console.log(`  医薬品    : ${result.deletedDrugs}件`)
  console.log(`  告知      : ${announcementCount}件`)
  console.log(`  ブックマーク: ${bookmarks.length}件`)
  console.log(`\n戻す場合: npm run seed:restore -- ${path.relative(process.cwd(), backupFile)}`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error instanceof Error ? error.message : error)
    await prisma.$disconnect()
    process.exit(1)
  })
