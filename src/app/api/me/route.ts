import { NextResponse } from "next/server"
import { getCurrentUser, type CurrentUser } from "@/app/api/_lib/getCurrentUser"

/**
 * ログイン中のユーザー情報の取得
 * Cookieのセッションから判定するため、クライアントはトークンを保持する必要がない
 */
export const GET = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json({ message: "認証が必要です" }, { status: 401 })
  }

  return NextResponse.json<CurrentUser>(currentUser, { status: 200 })
}
