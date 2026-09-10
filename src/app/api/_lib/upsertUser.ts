import { prisma } from "@/lib/prisma"
import type { CurrentUser } from "@/types/auth"

/**
 * 認証済みユーザーをDBに登録する
 * 初回のみ作成し、既存の場合はそのまま返す
 */
export const upsertUser = (
  supabaseUserId: string,
  email: string
): Promise<CurrentUser> =>
  prisma.user.upsert({
    where: { supabaseUserId },
    create: { supabaseUserId, email },
    update: {},
    select: { id: true, role: true, email: true },
  })
