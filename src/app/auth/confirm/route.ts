import { NextRequest, NextResponse } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { upsertUser } from "@/app/api/_lib/upsertUser"
import { NOTICE_QUERY_KEY, type NoticeKey } from "@/constants/notice"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

/** 確認後の遷移先と通知（メールの種別ごとに切り替える） */
const RESULT_BY_TYPE: Partial<
  Record<EmailOtpType, { path: string; notice: NoticeKey }>
> = {
  signup: { path: "/", notice: "signupConfirmed" },
  email_change: { path: "/mypage/account", notice: "emailChanged" },
}

/** 種別が判定できない場合の遷移先 */
const DEFAULT_PATH = "/"

/** 検証に失敗した場合の遷移先 */
const ERROR_PATH = "/login"

/**
 * 確認メールのリンクの受け口
 * トークンをサーバー側で検証し、そのままセッションをCookieとして発行する
 */
export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null

  // 遷移先を組み立てる（通知はキーのみを渡す）
  const buildUrl = (path: string, notice?: NoticeKey) => {
    const url = new URL(path, SITE_URL)

    if (notice) url.searchParams.set(NOTICE_QUERY_KEY, notice)

    return url
  }

  const errorUrl = buildUrl(ERROR_PATH, "confirmFailed")

  if (!tokenHash || !type) return NextResponse.redirect(errorUrl)

  const supabase = await createClient()

  // token_hashでの検証
  // 登録端末以外で開いても成立
  const { data, error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  })

  if (error || !data.user?.email) {
    return NextResponse.redirect(errorUrl)
  }

  await upsertUser(data.user.id, data.user.email)

  const result = RESULT_BY_TYPE[type]

  return NextResponse.redirect(buildUrl(result?.path ?? DEFAULT_PATH, result?.notice))
}
