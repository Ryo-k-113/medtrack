import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { LoginMethods } from "@/types/auth"

/** Supabaseが返すプロバイダ名 */
const PROVIDER = {
  google: "google",
  email: "email",
} as const

/**
 * ログイン中のユーザーが持つログイン方法の取得
 * Supabaseは認証手段ごとにidentityを持つため、利用中の方法を取り出す
 */
export const GET = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ message: "認証が必要です" }, { status: 401 })
  }

  const identities = user.identities ?? []

  // 各ログイン方法に紐づくメールアドレス（未設定の場合はnull）
  const findEmail = (provider: string): string | null => {
    const email = identities.find((identity) => identity.provider === provider)
      ?.identity_data?.email

    return typeof email === "string" ? email : null
  }

  return NextResponse.json<LoginMethods>(
    {
      googleEmail: findEmail(PROVIDER.google),
      loginEmail: findEmail(PROVIDER.email),
    },
    { status: 200 }
  )
}
