import { NextRequest } from "next/server"
import type { Role } from "@prisma/client"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

/** ログイン中のユーザー */
export type CurrentUser = {
  id: number
  role: Role
}

/**
 * ログイン中のユーザーを取得する
 * idはユーザー単位のDB操作に、roleは権限判定に使う
 * 判定・エラーレスポンスは呼び出し側で行う
 * @param request - リクエスト（Authorizationヘッダーからトークンを取得）
 * @returns ログイン中のユーザー。未認証・DBに未登録の場合はnull
 */

export const getCurrentUser = async (
  request: NextRequest
): Promise<CurrentUser | null> => {
  const supabase = await createClient()
  const authHeader = request.headers.get("Authorization")
  const token = authHeader?.replace("Bearer ", "")

  if(!token) return null

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) return null

  const currentUser = await prisma.user.findUnique({
    where: { supabaseUserId: user.id },
    select: { id: true, role: true },
  })

  return currentUser
}
