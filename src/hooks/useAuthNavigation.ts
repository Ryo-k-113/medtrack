"use client"

import { useRouter } from "next/navigation"
import { REDIRECT_TO_QUERY_KEY } from "@/constants/auth"

/** ログインページのパス */
export const LOGIN_PATH = "/login"

/** 新規登録ページのパス */
export const SIGNUP_PATH = "/signup"

/** 戻り先に含めないパス */
const AUTH_PATHS = [LOGIN_PATH, SIGNUP_PATH]

/**
 * 現在ページのパス（ログイン・登録の後に戻る先）
 * 認証ページは除外
 */
export const getCurrentPathForRedirect = (): string | null => {
  const { pathname, search } = window.location
  return AUTH_PATHS.includes(pathname) ? null : `${pathname}${search}`
}

/**
 * ログイン・新規登録ページへ移動する
 * 登録・ログインの後に元のページへ戻れるよう、現在ページを渡す
 */
export const useAuthNavigation = () => {
  const router = useRouter()

  const navigateToAuth = (path: string) => {
    const redirectTo = getCurrentPathForRedirect()
    const query = redirectTo ? `?${REDIRECT_TO_QUERY_KEY}=${encodeURIComponent(redirectTo)}` : ""
    router.push(`${path}${query}`)
  }

  return {
    navigateToLogin: () => navigateToAuth(LOGIN_PATH),
    navigateToSignup: () => navigateToAuth(SIGNUP_PATH),
  }
}
