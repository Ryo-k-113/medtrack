import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser, type CurrentUser } from "@/app/api/_lib/getCurrentUser"

type AdminAuthResult =
  | { user: CurrentUser; errorResponse: null }
  | { user: null; errorResponse: NextResponse }

/**
 * 管理者ユーザーを取得するガード関数
 * 未認証なら401、管理者権限がなければ403のレスポンスを返す
 * @param request - リクエスト
 * @returns 管理者ユーザー、またはそのまま返せるエラーレスポンス
 */
export const getAdminUser = async (request: NextRequest): Promise<AdminAuthResult> => {
  const user = await getCurrentUser(request)

  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json({ message: "認証が必要です" }, { status: 401 }),
    }
  }

  if (user.role !== "ADMIN") {
    return {
      user: null,
      errorResponse: NextResponse.json({ message: "管理者権限がありません" }, { status: 403 }),
    }
  }

  return { user, errorResponse: null }
}
