import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { COOKIE_OPTIONS } from "@/lib/supabase/cookieOptions"

/** 未認証時の遷移先 */
const LOGIN_PATH = "/login"

/** 権限が不足している場合の遷移先 */
const TOP_PATH = "/"

/** 管理者権限が必要なパスの接頭辞 */
const ADMIN_PATH = "/admin"

/** 管理者ログインページ（対象外にする） */
const ADMIN_LOGIN_PATH = "/admin/login"


/** 認証が必要なページへのアクセスを制御する */
export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl

  // 管理者ログインページ自体は認証不要
  if (pathname.startsWith(ADMIN_LOGIN_PATH)) {
    return NextResponse.next({ request })
  }

  // setAllで差し替えるため、参照を保持できる形で持つ
  const ref = { response: NextResponse.next({ request }) }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          ref.response = NextResponse.next({ request })

          cookiesToSet.forEach(({ name, value, options }) =>
            ref.response.cookies.set(name, value, {
              ...options,
              ...COOKIE_OPTIONS,
            })
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone()
    url.pathname = path

    return NextResponse.redirect(url)
  }

  // 未認証は、ユーザー向けのログインページへ送る
  if (!user) return redirectTo(LOGIN_PATH)

  // 管理者ページは権限も確認する
  if (pathname.startsWith(ADMIN_PATH)) {
    const role =
      typeof user.app_metadata?.role === "string" ? user.app_metadata.role : null

    // ユーザー向けのトップページへ送る
    if (role !== "ADMIN") return redirectTo(TOP_PATH)
  }

  return ref.response
}

export const config = {
  // 保護が必要なページのみを対象
  matcher: ["/admin/:path*", "/mypage/:path*"],
}
