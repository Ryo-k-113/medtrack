import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/app/api/_lib/getCurrentUser"
import type { BookmarkIdsResponse } from "@/types/bookmark"


/** ブックマーク済みの医薬品IDのみを取得(ブックマークボタンの状態判定) */
export const GET = async (request: NextRequest) => {
  // 認証チェック
  const currentUser = await getCurrentUser(request)

  if (!currentUser) {
    return NextResponse.json({ message: "認証が必要です" }, { status: 401 })
  }

  try {
    const bookmarks = await prisma.bookmarkDrug.findMany({
      where: { userId: currentUser.id },
      select: { id: true, drugId: true },
    })

    return NextResponse.json<BookmarkIdsResponse>({ bookmarks }, { status: 200 })

  } catch {
    return NextResponse.json({ message: "エラーが発生しました" }, { status: 400 })
  }
}
