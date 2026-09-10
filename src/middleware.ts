import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { COOKIE_OPTIONS } from "@/lib/supabase/cookieOptions"
import { REDIRECT_TO_QUERY_KEY } from "@/constants/auth"

/** 未認証時の遷移先 */
const LOGIN_PATH = "/login"

/** 権限が不足している場合の遷移先 */
const TOP_PATH = "/"

/** 管理者を表すロール（Prismaのenumに合わせる） */
const ADMIN_ROLE = "ADMIN"

/** ログインが必要なパスの接頭辞 */
const USER_PROTECTED_PATHS = ["/mypage"]

/** 管理者権限が必要なパスの接頭辞 */
const ADMIN_PATH = "/admin"

/** 管理者ログインページ（未認証でも表示する） */
const ADMIN_LOGIN_PATH = "/admin/login"


/** 認証が必要なページへのアクセスを制御する */
export const middleware = async (request: NextRequest) => {
  const { pathname, search } = request.nextUrl

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

  // 元のクエリは引き継がず、遷移先だけを差し替える
  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone()
    url.pathname = path
    url.search = ""

    return NextResponse.redirect(url)
  }

  // 管理者ログインページは、認証状態にかかわらずそのまま表示する
  const isAdminPath =
    pathname.startsWith(ADMIN_PATH) && !pathname.startsWith(ADMIN_LOGIN_PATH)

  if (!user) {
    // ログイン後に元のページへ戻れるよう、アクセス先を引き継ぐ
    if (USER_PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
      const url = request.nextUrl.clone()
      url.pathname = LOGIN_PATH
      url.search = ""
      url.searchParams.set(REDIRECT_TO_QUERY_KEY, `${pathname}${search}`)

      return NextResponse.redirect(url)
    }

    // 管理画面の存在を伏せるため、ログインページには送らない
    if (isAdminPath) return redirectTo(TOP_PATH)

    return ref.response
  }

  // 管理者ページは権限も確認する
  if (isAdminPath) {
    // 設定値の表記揺れで権限判定が静かに失敗しないよう、大文字に揃えて比較する
    const role =
      typeof user.app_metadata?.role === "string"
        ? user.app_metadata.role.toUpperCase()
        : null

    // ユーザー向けのトップページへ送る
    if (role !== ADMIN_ROLE) return redirectTo(TOP_PATH)
  }

  return ref.response
}

export const config = {
  
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
}
