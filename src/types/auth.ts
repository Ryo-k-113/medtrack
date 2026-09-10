import type { Role } from "@prisma/client"
import { z } from "zod"

/** メールアドレスの条件 */
export const emailSchema = z.email({
  message: "有効なメールアドレスを入力してください",
})

/** パスワードの条件（英字・数字・記号を含む8文字以上） */
export const passwordSchema = z
  .string()
  .min(8, { message: "パスワードは8文字以上で入力してください" })
  .refine((value) => /[a-zA-Z]/.test(value), {
    message: "アルファベットを含めてください",
  })
  .refine((value) => /[0-9]/.test(value), {
    message: "数字を含めてください",
  })
  .refine((value) => /[@$!%*#?&]/.test(value), {
    message: "記号（@$!%*#?&）を含めてください",
  })

/** ログイン・新規登録の入力 */
export const authSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type AuthFormData = z.infer<typeof authSchema>


/** ログイン方法ごとのメールアドレス（未設定はnull） */
export type LoginMethods = {
  googleEmail: string | null
  loginEmail: string | null
}


/** ログイン中のユーザー */
export type CurrentUser = {
  id: number
  role: Role
  email: string
}
