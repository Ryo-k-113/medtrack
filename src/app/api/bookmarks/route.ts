import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/app/api/_lib/getCurrentUser"
import type { BookmarksResponse } from "@/types/bookmark"

/** ブックマークした医薬品の一覧取得 */
export const GET = async (request: NextRequest) => {
  // 認証チェック
  const currentUser = await getCurrentUser(request)

  if (!currentUser) {
    return NextResponse.json({ message: "認証が必要です" }, { status: 401 })
  }

  try {
    const bookmarks = await prisma.bookmarkDrug.findMany({
      where: { userId: currentUser.id },
      select: {
        Drug: {
          select: {
            id: true,
            name: true,
            yjCode: true,
            productType: true,
            price: true,
            packageInsertUrl: true,
            Unit: { select: { id: true, name: true } },
            GenericName: { select: { id: true, name: true } },
            SalesCompany: { select: { id: true, name: true } },
            PackageUnits: {
              where: { publishStatus: "PUBLISHED" },
              select: { id: true, name: true, currentShippingStatus: true },
              orderBy: { id: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // レスポンスデータの変換（Decimal型をnumberへ変換）
    const drugs = bookmarks.map(({ Drug }) => ({
      ...Drug,
      price: Drug.price ? Number(Drug.price) : null,
    }))
    
    return NextResponse.json<BookmarksResponse>({ drugs }, { status: 200 })

  } catch {
    return NextResponse.json({ message: "エラーが発生しました" }, { status: 400 })
  }
}
