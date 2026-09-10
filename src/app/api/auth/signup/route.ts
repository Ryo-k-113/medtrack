import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { authSchema } from "@/types/auth"

/**
 * 新規登録
 * 確認メールのリンクを開いた時点でログインが完了する
 */
export const POST = async (request: NextRequest) => {
  try {
    const parsed = authSchema.safeParse(await request.json())

    if (!parsed.success) {
      return NextResponse.json({ message: "入力内容が正しくありません" }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({
      ...parsed.data,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm` },
    })

    if (error) {
      const message = error.message.includes("already")
        ? "すでに登録されているメールアドレスです"
        : "登録処理でエラーが発生しました"

      return NextResponse.json({ message }, { status: 400 })
    }

    return NextResponse.json({ message: "登録確認メールを送信しました" }, { status: 201 })

  } catch {
    return NextResponse.json({ message: "エラーが発生しました" }, { status: 500 })
  }
}
