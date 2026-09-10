"use client"

import { useDataFetch } from "@/hooks/useDataFetch"
import { useMe } from "@/hooks/useMe"
import type { LoginMethods } from "@/types/auth"

/** ログイン方法の取得先 */
const LOGIN_METHODS_API_PATH = "/api/me/login-methods"

/**
 * ログイン中のユーザーが持つログイン方法を判定するカスタムフック
 * @returns ログイン方法ごとのメールアドレス、ログイン状態
 */
export const useLoginMethods = () => {
  const { isLoggedIn, isLoading: isUserLoading } = useMe()

  // 未ログイン時はリクエストしない
  const { data, isLoading } = useDataFetch<LoginMethods>(
    isLoggedIn ? LOGIN_METHODS_API_PATH : null
  )

  return {
    isLoading: isUserLoading || isLoading,
    isLoggedIn,
    googleEmail: data?.googleEmail ?? null,
    loginEmail: data?.loginEmail ?? null,
  }
}
