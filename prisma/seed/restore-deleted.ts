/**
 * delete-packages.ts が書き出した控えから、削除したデータを元のIDのまま戻す
 *
 * 実行
 *   npm run seed:restore -- 控えのファイル            確認のみ（DBは変更しない）
 *   npm run seed:restore -- 控えのファイル --apply    戻す
 *
 * 接続先は DATABASE_URL。本番に対して実行する場合は、実行時だけ本番の値を指定する
 */
import { readFileSync } from "node:fs"
import path from "node:path"

import { PrismaClient, type Prisma } from "@prisma/client"

const prisma = new PrismaClient()

/** 控えの内容（削除した行をそのまま保存したもの） */
type Backup = {
  deletedAt: string
  reason: string
  drugs: Prisma.DrugUncheckedCreateInput[]
  packages: Prisma.PackageUnitUncheckedCreateInput[]
  shippingAnnouncements: Prisma.ShippingAnnouncementUncheckedCreateInput[]
  bookmarkDrugs: Prisma.BookmarkDrugUncheckedCreateInput[]
}

/** 接続先のSupabaseプロジェクトID（開発と本番を取り違えないよう最初に表示する） */
const describeTarget = (): string => {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL が設定されていません")
  const { username, hostname } = new URL(url)
  return `${username.split(".")[1] ?? "(不明)"}（${hostname}）`
}

const main = async () => {
  const args = process.argv.slice(2).filter((arg) => arg !== "--apply")
  const backupPath = args[0]
  if (!backupPath) throw new Error("控えのファイルを指定してください")

  const isApply = process.argv.includes("--apply")
  const backup: Backup = JSON.parse(readFileSync(path.resolve(backupPath), "utf-8"))

  console.log(`接続先    : ${describeTarget()}`)
  console.log(`実行モード: ${isApply ? "戻す（--apply）" : "確認のみ（DBは変更しない）"}`)
  console.log(`控え      : ${backupPath}（${backup.deletedAt} に削除）\n`)

  console.log("■ 控えの内容")
  console.log(`  医薬品      : ${backup.drugs.length}件`)
  console.log(`  包装        : ${backup.packages.length}件`)
  console.log(`  告知        : ${backup.shippingAnnouncements.length}件`)
  console.log(`  ブックマーク: ${backup.bookmarkDrugs.length}件`)

  // すでに戻っている行があると重複するため、先に確かめる
  const [existingDrugs, existingPackages] = await Promise.all([
    prisma.drug.count({ where: { id: { in: backup.drugs.map((drug) => drug.id as number) } } }),
    prisma.packageUnit.count({
      where: { id: { in: backup.packages.map((pkg) => pkg.id as number) } },
    }),
  ])
  if (existingDrugs > 0 || existingPackages > 0) {
    console.log(`\n  すでにDBにある行: 医薬品 ${existingDrugs}件 / 包装 ${existingPackages}件`)
    console.log("  重複を避けるため、これらは戻しません")
  }

  if (!isApply) {
    console.log("\n確認のみのため、DBは変更していません。戻すには --apply を付けて実行してください")
    return
  }

  // 医薬品 → 包装 → 告知・ブックマークの順に戻す（外部キーの依存の順）
  const result = await prisma.$transaction(async (tx) => {
    const drugs = await tx.drug.createMany({ data: backup.drugs, skipDuplicates: true })
    const packages = await tx.packageUnit.createMany({ data: backup.packages, skipDuplicates: true })
    const announcements = await tx.shippingAnnouncement.createMany({
      data: backup.shippingAnnouncements,
      skipDuplicates: true,
    })
    const bookmarks = await tx.bookmarkDrug.createMany({
      data: backup.bookmarkDrugs,
      skipDuplicates: true,
    })
    return {
      drugs: drugs.count,
      packages: packages.count,
      announcements: announcements.count,
      bookmarks: bookmarks.count,
    }
  })

  console.log("\n戻しました")
  console.log(`  医薬品      : ${result.drugs}件`)
  console.log(`  包装        : ${result.packages}件`)
  console.log(`  告知        : ${result.announcements}件`)
  console.log(`  ブックマーク: ${result.bookmarks}件`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error instanceof Error ? error.message : error)
    await prisma.$disconnect()
    process.exit(1)
  })
