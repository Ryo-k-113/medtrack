"use client"

import { useSupabaseSession } from "@/hooks/useSupabaseSession"

/** Supabaseが返すプロバイダ名 */
const PROVIDER = {
  google: "google",
  email: "email",
} as const

/**
 * ログイン中のユーザーが持つログイン方法を判定するカスタムフック
 * Supabaseは認証手段ごとにidentityを持つため、利用中の方法を取り出す
 * @returns ログイン方法ごとのメールアドレス、ログイン状態
 */
export const useLoginMethods = () => {
  const { session, isLoading } = useSupabaseSession()

  const identities = session?.user.identities ?? []

  // 各ログイン方法に紐づくメールアドレス（未設定の場合はnull）
  const findEmail = (provider: string) =>
    identities.find((identity) => identity.provider === provider)
      ?.identity_data?.email ?? null

  return {
    isLoading,
    isLoggedIn: !!session,
    googleEmail: findEmail(PROVIDER.google) as string | null,
    loginEmail: findEmail(PROVIDER.email) as string | null,
  }
}
