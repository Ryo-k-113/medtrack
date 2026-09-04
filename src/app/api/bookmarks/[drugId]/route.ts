import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/app/api/_lib/getCurrentUser"
import type { DeleteBookmarkResponse } from "@/types/bookmark"

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
    // 未登録でもエラーにしない
    await prisma.bookmarkDrug.deleteMany({
      where: { userId: currentUser.id, drugId },
    })

    return NextResponse.json<DeleteBookmarkResponse>(
      { message: "ブックマークを解除しました" },
      { status: 200 }
    )

  } catch {
    return NextResponse.json({ message: "エラーが発生しました" }, { status: 400 })
  }
}
