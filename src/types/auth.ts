import type { Role } from "@prisma/client"
import { z } from "zod"

export const authSchema = z.object({
  email: z.email({
    message: "メールアドレスの形式が正しくありません"
  }),
  password: z.string().min(8, {
    message: "8文字以上で入力してください"
  }),
})
export type AuthFormData = z.infer<typeof authSchema>


/** ログイン中のユーザー */
export type CurrentUser = {
  id: number
  role: Role
  email: string
}
