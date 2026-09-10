import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { upsertUser } from "@/app/api/_lib/upsertUser"
import { redirectWithNotice } from "@/app/api/_lib/redirectWithNotice"
import { OAUTH_REDIRECT_COOKIE, resolveRedirectPath } from "@/constants/auth"

/** ログインに失敗した場合の遷移先 */
const LOGIN_PATH = "/login"

/**
 * Googleログインのコールバック
 * 受け取った認可コードをサーバー側でセッションに交換し、Cookieとして発行する
 */
export const GET = async (request: NextRequest) => {
  const code = request.nextUrl.searchParams.get("code")

  const redirectToError = () => redirectWithNotice(LOGIN_PATH, "loginFailed")

  if (!code) return redirectToError()

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user?.email) {
    console.error("Googleログインに失敗しました", error)

    return redirectToError()
  }

  await upsertUser(data.user.id, data.user.email)

  // ログイン開始時に預けた戻り先へ遷移し、役目を終えたCookieは削除する
  const redirectPath = resolveRedirectPath(
    request.cookies.get(OAUTH_REDIRECT_COOKIE)?.value
  )

  const response = redirectWithNotice(redirectPath, "loginSucceeded")
  response.cookies.delete(OAUTH_REDIRECT_COOKIE)

  return response
}
