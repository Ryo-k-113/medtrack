import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { emailSchema } from "@/types/auth"

/** 確認リンクから戻る先 */
const EMAIL_REDIRECT_TO = `${process.env.NEXT_PUBLIC_SITE_URL}/mypage/account`

const requestSchema = z.object({ email: emailSchema })

/**
 * メールアドレスの変更
 * 新しいアドレスへ確認メールが送られ、リンクを開くまで変更は確定しない
 */
export const PUT = async (request: NextRequest) => {
  try {
    const parsed = requestSchema.safeParse(await request.json())

    if (!parsed.success) {
      return NextResponse.json(
        { message: "メールアドレスの形式が正しくありません。" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ message: "認証が必要です" }, { status: 401 })
    }

    const { error } = await supabase.auth.updateUser(
      { email: parsed.data.email },
      { emailRedirectTo: EMAIL_REDIRECT_TO }
    )

    if (error) {
      console.error("メールアドレスの変更に失敗しました", error)

      const message = error.message.includes("already")
        ? "すでに使用されているメールアドレスです。"
        : "メールアドレスの変更に失敗しました。"

      return NextResponse.json({ message }, { status: 400 })
    }

    return NextResponse.json(
      { message: "確認メールを送信しました。メール内のリンクを開くと変更が完了します。" },
      { status: 200 }
    )

  } catch {
    return NextResponse.json({ message: "エラーが発生しました" }, { status: 500 })
  }
}
