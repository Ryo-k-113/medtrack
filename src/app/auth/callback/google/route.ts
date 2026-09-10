import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { upsertUser } from "@/app/api/_lib/upsertUser"
import { redirectWithNotice } from "@/app/api/_lib/redirectWithNotice"

/** ログイン後の遷移先 */
const TOP_PATH = "/"

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

  return redirectWithNotice(TOP_PATH, "loginSucceeded")
}
