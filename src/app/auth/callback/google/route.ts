import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { upsertUser } from "@/app/api/_lib/upsertUser"

/** 認証後の遷移先 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

/**
 * Googleログインのコールバック
 * 受け取った認可コードをサーバー側でセッションに交換し、Cookieとして発行する
 */
export const GET = async (request: NextRequest) => {
  const code = request.nextUrl.searchParams.get("code")

  if (!code) return NextResponse.redirect(`${SITE_URL}/login`)

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    console.error("Googleログインに失敗しました", error)

    return NextResponse.redirect(`${SITE_URL}/login`)
  }

  await upsertUser(data.user.id, data.user.email!)

  return NextResponse.redirect(`${SITE_URL}/`)
}
