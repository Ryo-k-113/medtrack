import type { Role } from "@prisma/client"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

/** ログイン中のユーザー */
export type CurrentUser = {
  id: number
  role: Role
  email: string
}

/**
 * ログイン中のユーザーを取得する
 * idはユーザー単位のDB操作に、roleは権限判定に使う
 * 判定・エラーレスポンスは呼び出し側で行う
 * @returns ログイン中のユーザー。未認証・DBに未登録の場合はnull
 */
export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  const supabase = await createClient()


  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) return null


  const currentUser = await prisma.user.findUnique({
    where: { supabaseUserId: user.id },
    select: { id: true, role: true, email: true },
  })

  return currentUser
}
