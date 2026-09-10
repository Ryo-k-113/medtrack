import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/** 認証後の戻り先 */
const CALLBACK_URL = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback/google`

/**
 * Googleログインの開始
 * 認証情報のやり取りをサーバー側で完結させるため、ブラウザからは遷移するだけ
 */
export const GET = async () => {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: CALLBACK_URL },
  })

  if (error || !data.url) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login`)
  }

  return NextResponse.redirect(data.url)
}
