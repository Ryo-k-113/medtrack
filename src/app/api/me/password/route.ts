import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { passwordSchema } from "@/types/auth"

const requestSchema = z.object({ password: passwordSchema })

/** パスワードの変更 */
export const PUT = async (request: NextRequest) => {
  try {
    const parsed = requestSchema.safeParse(await request.json())

    if (!parsed.success) {
      return NextResponse.json(
        { message: "パスワードの条件を満たしていません。" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ message: "認証が必要です" }, { status: 401 })
    }

    const { error } = await supabase.auth.updateUser({ password: parsed.data.password })

    if (error) {
      console.error("パスワードの変更に失敗しました", error)

      const message = error.message.includes("different from the old password")
        ? "現在のパスワードとは異なるパスワードを入力してください。"
        : "パスワードの変更に失敗しました。"

      return NextResponse.json({ message }, { status: 400 })
    }

    return NextResponse.json({ message: "パスワードを変更しました。" }, { status: 200 })

  } catch {
    return NextResponse.json({ message: "エラーが発生しました" }, { status: 500 })
  }
}
