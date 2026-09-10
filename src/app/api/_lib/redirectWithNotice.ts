import { NextResponse } from "next/server"
import { NOTICE_QUERY_KEY, type NoticeKey } from "@/constants/notice"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

/**
 * 通知のキーを付けてリダイレクトする
 * 文言はURLに載せず、キーのみを受け渡す
 */
export const redirectWithNotice = (path: string, notice?: NoticeKey) => {
  const url = new URL(path, SITE_URL)

  if (notice) url.searchParams.set(NOTICE_QUERY_KEY, notice)

  return NextResponse.redirect(url)
}
