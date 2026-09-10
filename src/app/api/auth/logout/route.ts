import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"


/** ログアウト */
export const POST = async () => {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json({ message: "ログアウトに失敗しました" }, { status: 500 })
  }

  return NextResponse.json({ message: "ログアウトしました" }, { status: 200 })
}
