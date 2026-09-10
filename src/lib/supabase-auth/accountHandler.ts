"use client"

import { toast } from "sonner"
import { fetcher } from "@/utils/fetcher"

/**
 * メールアドレスの変更
 * 新しいアドレスへ確認メールが送られ、リンクを踏むまで変更は確定しない
 * @param email - 変更後のメールアドレス
 * @returns 送信に成功したかどうか
 */
export const updateEmailHandler = async (email: string): Promise<boolean> => {
  try {
    const { message } = await fetcher({
      url: "/api/me/email",
      method: "PUT",
      body: { email },
    })

    toast.success(message, { duration: 8000 })
    return true

  } catch {
    toast.error("メールアドレスの変更に失敗しました。")
    return false
  }
}

/**
 * パスワードの変更
 * @param password - 新しいパスワード
 * @returns 変更に成功したかどうか
 */
export const updatePasswordHandler = async (password: string): Promise<boolean> => {
  try {
    const { message } = await fetcher({
      url: "/api/me/password",
      method: "PUT",
      body: { password },
    })

    toast.success(message)
    return true

  } catch  {
    toast.error( "パスワードの変更に失敗しました。")
    return false
  }
}
