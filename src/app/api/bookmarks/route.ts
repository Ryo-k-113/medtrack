import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/app/api/_lib/getCurrentUser"
import type { BookmarksResponse, CreateBookmarkRequest } from "@/types/bookmark"

/** 1ユーザーあたりのブックマーク上限 */
const MAX_BOOKMARKS = 1000

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

/** ブックマークの登録 */
export const POST = async (request: NextRequest) => {
  // 認証チェック
  const currentUser = await getCurrentUser(request)

  if (!currentUser) {
    return NextResponse.json({ message: "認証が必要です" }, { status: 401 })
  }

  try {
    const body: CreateBookmarkRequest = await request.json()
    const drugId = Number(body.drugId)

    if (!drugId) {
      return NextResponse.json({ message: "医薬品IDが不正です" }, { status: 400 })
    }

    // 医薬品の存在チェック
    const drug = await prisma.drug.findUnique({
      where: { id: drugId },
      select: { id: true },
    })

    if (!drug) {
      return NextResponse.json({ message: "医薬品が見つかりません" }, { status: 404 })
    }

    // ブックマークの上限チェック
    const bookmarkCount = await prisma.bookmarkDrug.count({
      where: { userId: currentUser.id },
    })

    if (bookmarkCount >= MAX_BOOKMARKS) {
      return NextResponse.json(
        { message: `ブックマークは${MAX_BOOKMARKS}件までです` },
        { status: 400 }
      )
    }

    // 登録済みの場合は何もしない
    await prisma.bookmarkDrug.upsert({
      where: { userId_drugId: { userId: currentUser.id, drugId } },
      create: { userId: currentUser.id, drugId },
      update: {},
    })

    return NextResponse.json({ message: "ブックマークに追加しました" }, { status: 201 })

  } catch {
    return NextResponse.json({ message: "エラーが発生しました" }, { status: 400 })
  }
}
