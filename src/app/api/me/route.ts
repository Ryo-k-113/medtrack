import { NextResponse } from "next/server"
import { getCurrentUser } from "@/app/api/_lib/getCurrentUser"
import type { CurrentUser } from "@/types/auth"

/**
 * ログイン中のユーザー情報の取得
 */
export const GET = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.json({ message: "認証が必要です" }, { status: 401 })
  }

  return NextResponse.json<CurrentUser>(currentUser, { status: 200 })
}
