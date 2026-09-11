import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"
import { getJstToday, toUTCDate } from "@/utils/date"
import type { PackageAnnouncementResponse } from "@/types/user/drug"

/** 公開中の告知情報・包装のみを対象にする条件 */
const PUBLISHED_WHERE: Prisma.ShippingAnnouncementWhereInput = {
  publishStatus: "PUBLISHED",
  PackageUnit: { publishStatus: "PUBLISHED" },
}

/**
 * 今日（日本時間）以前で、最も新しい告知日を取得する
 * 未来日の告知は「直近の更新」として扱わない
 */
const findLatestAnnouncedDate = async () => {
  const latest = await prisma.shippingAnnouncement.findFirst({
    where: { ...PUBLISHED_WHERE, announcedDate: { lte: getJstToday() } },
    orderBy: { announcedDate: "desc" },
    select: { announcedDate: true },
  })

  return latest?.announcedDate ?? null
}

/**
 * 医薬品の更新情報（告知日）に基づく包装の一覧取得
 * dateを省略した場合は、直近の告知日の一覧を返す
 */
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)

    // 対象日（省略時は直近の告知日）
    const date = searchParams.get("date")
    const targetDate = date ? toUTCDate(date) : await findLatestAnnouncedDate()

    // 告知がまだ1件もない場合
    if (!targetDate) {
      return NextResponse.json<PackageAnnouncementResponse>(
        { items: [], announcedCount: 0, date: null },
        { status: 200 }
      )
    }

    const nextDate = new Date(targetDate)
    nextDate.setUTCDate(nextDate.getUTCDate() + 1)

    const baseWhere: Prisma.ShippingAnnouncementWhereInput = {
      ...PUBLISHED_WHERE,
      announcedDate: { gte: targetDate, lt: nextDate },
    }


    const [histories, announcedCount] = await Promise.all([
      prisma.shippingAnnouncement.findMany({
        where: baseWhere,
        select: {
          id: true,
          announceType: true,
          announcedDate: true,
          effectiveDate: true,
          PackageUnit: {
            select: {
              id: true,
              name: true,
              currentShippingStatus: true,
              Drug: {
                select: {
                  id: true,
                  name: true,
                  productType: true,
                  GenericName: { select: { id: true, name: true } },
                  SalesCompany: { select: { id: true, name: true } },
                },
              },
            },
          },
        },
        orderBy: { id: "asc" },
      }),
      prisma.shippingAnnouncement.count({ where: baseWhere }),
    ])

    // レスポンスデータの変換（Date型をstringへ変換）
    const items = histories.map((history) => ({
      ...history,
      announcedDate: history.announcedDate?.toISOString() ?? null,
      effectiveDate: history.effectiveDate?.toISOString() ?? null,
    }))

    // レスポンスを返す
    // 対象日はUTCの0時で持つため、ISO形式の日付部分がそのまま日本時間の日付になる
    return NextResponse.json<PackageAnnouncementResponse>(
      { items, announcedCount, date: targetDate.toISOString().slice(0, 10) },
      { status: 200 }
    )

  } catch {
    return NextResponse.json({ message: "エラーが発生しました" }, { status: 400 })
  }
}
