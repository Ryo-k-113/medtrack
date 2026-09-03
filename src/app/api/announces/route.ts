import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"
import { toUTCDate } from "@/utils/date"
import type { PackageAnnouncementResponse } from "@/types/user/drug"

/** 医薬品の更新情報（告知日）に基づく包装の一覧取得 */
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)

    // 対象日
    const date = searchParams.get("date")
    const targetDate = toUTCDate(date)

    if (!targetDate) {
      return NextResponse.json({ message: "dateは必須です" }, { status: 400 })
    }

    const nextDate = new Date(targetDate)
    nextDate.setUTCDate(nextDate.getUTCDate() + 1)

    // 公開中の告知情報・包装のみを対象
    const baseWhere: Prisma.AnnounceHistoryWhereInput = {
      publishStatus: "PUBLISHED",
      PackageUnit: { publishStatus: "PUBLISHED" },
      announcedDate: { gte: targetDate, lt: nextDate },
    }


    const [histories, announcedCount] = await Promise.all([
      prisma.announceHistory.findMany({
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
      prisma.announceHistory.count({ where: baseWhere }),
    ])

    // レスポンスデータの変換（Date型をstringへ変換）
    const items = histories.map((history) => ({
      ...history,
      announcedDate: history.announcedDate?.toISOString() ?? null,
      effectiveDate: history.effectiveDate?.toISOString() ?? null,
    }))

    // レスポンスを返す
    return NextResponse.json<PackageAnnouncementResponse>(
      { items, announcedCount },
      { status: 200 }
    )

  } catch {
    return NextResponse.json({ message: "エラーが発生しました" }, { status: 400 })
  }
}
