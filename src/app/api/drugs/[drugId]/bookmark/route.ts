import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/app/api/_lib/getCurrentUser"
import type {
  CreateBookmarkRequest,
  CreateBookmarkResponse,
  DeleteBookmarkRequest,
  DeleteBookmarkResponse,
} from "@/types/bookmark"

/** 1ユーザーあたりのブックマーク上限 */
const MAX_BOOKMARKS = 1000

/** ブックマークの登録 */
export const POST = async (
  request: NextRequest,
  { params }: { params: { drugId: string } }
) => {
  // 認証チェック
  const currentUser = await getCurrentUser(request)

  if (!currentUser) {
    return NextResponse.json({ message: "認証が必要です" }, { status: 401 })
  }

  try {
    const body: CreateBookmarkRequest = await request.json()
    const drugId = Number(body.drugId)

    if (!drugId) {
      return NextResponse.json({ message: "医薬品IDは必須です" }, { status: 400 })
    }

    // パスとボディで対象がずれている場合は不正なリクエストとして扱う
    if (drugId !== Number(params.drugId)) {
      return NextResponse.json(
        { message: "医薬品IDが一致しません" },
        { status: 400 }
      )
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
    const bookmark = await prisma.bookmarkDrug.upsert({
      where: { userId_drugId: { userId: currentUser.id, drugId } },
      create: { userId: currentUser.id, drugId },
      update: {},
      select: { id: true, drugId: true },
    })

    return NextResponse.json<CreateBookmarkResponse>(
      { message: "ブックマークに追加しました", bookmark },
      { status: 201 }
    )

  } catch {
    return NextResponse.json({ message: "エラーが発生しました" }, { status: 400 })
  }
}


/** ブックマークの解除 */
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { drugId: string } }
) => {
  // 認証チェック
  const currentUser = await getCurrentUser(request)

  if (!currentUser) {
    return NextResponse.json({ message: "認証が必要です" }, { status: 401 })
  }

  const drugId = Number(params.drugId)

  if (!drugId) {
    return NextResponse.json({ message: "医薬品IDが不正です" }, { status: 400 })
  }

  try {
    const body: DeleteBookmarkRequest = await request.json()
    const bookmarkId = Number(body.bookmarkId)

    if (!bookmarkId) {
      return NextResponse.json({ message: "ブックマークIDは必須です" }, { status: 400 })
    }

    // userIdとdrugIdで対象のブックマークを絞り込み
    const { count } = await prisma.bookmarkDrug.deleteMany({
      where: { id: bookmarkId, userId: currentUser.id, drugId },
    })

    if (count === 0) {
      return NextResponse.json(
        { message: "対象のブックマークが見つかりません" },
        { status: 404 }
      )
    }

    return NextResponse.json<DeleteBookmarkResponse>(
      { message: "ブックマークを解除しました" },
      { status: 200 }
    )

  } catch {
    return NextResponse.json({ message: "エラーが発生しました" }, { status: 400 })
  }
}
