"use client"

import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

/**
 * メールアドレスの変更
 * 新しいアドレスへ確認メールが送られ、リンクを踏むまで変更は確定しない
 * @param email - 変更後のメールアドレス
 * @returns 送信に成功したかどうか
 */
export const updateEmailHandler = async (email: string): Promise<boolean> => {
  const supabase = createClient()

  const { error } = await supabase.auth.updateUser(
    { email },
    { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/mypage/account` }
  )

  if (error) {

    const message = error.message.includes("already")
      ? "すでに使用されているメールアドレスです。"
      : "メールアドレスの変更に失敗しました。"

    toast.error(message)
    return false
  }
  toast.success(
    "確認メールを送信しました。メール内のリンクを開くと変更が完了します。", 
    { duration: 8000 }
  )
  return true
}

