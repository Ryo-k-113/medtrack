import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { redirectWithNotice } from "@/app/api/_lib/redirectWithNotice"
import { COOKIE_OPTIONS } from "@/lib/supabase/cookieOptions"
import {
  OAUTH_REDIRECT_COOKIE,
  OAUTH_REDIRECT_MAX_AGE,
  REDIRECT_TO_QUERY_KEY,
  resolveRedirectPath,
} from "@/constants/auth"

/** 認証後の戻り先 */
const CALLBACK_URL = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback/google`

/**
 * Googleログインの開始
 * 認証情報のやり取りをサーバー側で完結させるため、ブラウザからは遷移するだけ
 */
export const GET = async (request: NextRequest) => {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: CALLBACK_URL },
  })

  if (error || !data.url) {
    console.error("Googleログインに失敗しました", error)

    return redirectWithNotice("/login", "loginFailed")
  }

  const response = NextResponse.redirect(data.url)

  // 認証中は外部サイトへ遷移するため、ログイン後の戻り先はCookieで引き継ぐ
  const redirectPath = resolveRedirectPath(
    request.nextUrl.searchParams.get(REDIRECT_TO_QUERY_KEY)
  )

  response.cookies.set(OAUTH_REDIRECT_COOKIE, redirectPath, {
    ...COOKIE_OPTIONS,
    path: "/",
    maxAge: OAUTH_REDIRECT_MAX_AGE,
  })

  return response
}
