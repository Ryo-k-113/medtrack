import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { upsertUser } from "@/app/api/_lib/upsertUser"
import { authSchema, type CurrentUser } from "@/types/auth"

/**
 * ログイン
 * サーバー側で認証し、セッションはCookieとして発行する
 */
export const POST = async (request: NextRequest) => {
  try {
    const parsed = authSchema.safeParse(await request.json())

    if (!parsed.success) {
      return NextResponse.json({ message: "入力内容が正しくありません" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data)

    if (error || !data.user) {
      return NextResponse.json(
        { message: "メールアドレスまたはパスワードが異なります" },
        { status: 401 }
      )
    }

    const currentUser = await upsertUser(data.user.id, data.user.email!)

    return NextResponse.json<CurrentUser>(currentUser, { status: 200 })

  } catch {
    return NextResponse.json({ message: "エラーが発生しました" }, { status: 500 })
  }
}
