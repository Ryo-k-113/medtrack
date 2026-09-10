import type { NextRequest } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { upsertUser } from "@/app/api/_lib/upsertUser"
import { redirectWithNotice } from "@/app/api/_lib/redirectWithNotice"
import type { NoticeKey } from "@/constants/notice"

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

  const redirectToError = () => redirectWithNotice(ERROR_PATH, "confirmFailed")

  if (!tokenHash || !type) return redirectToError()

  const supabase = await createClient()

  // token_hashでの検証
  // 登録端末以外で開いても成立
  const { data, error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  })

  if (error || !data.user?.email) {
    return redirectToError()
  }

  await upsertUser(data.user.id, data.user.email)

  const result = RESULT_BY_TYPE[type]

  return redirectWithNotice(result?.path ?? DEFAULT_PATH, result?.notice)
}
