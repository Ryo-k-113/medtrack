import { z } from "zod"
import { authSchema } from "@/app/(public)/(auth)/_schemas/authSchema"

/** メールアドレス変更のバリデーション（登録時と同じ条件を使う） */
export const emailChangeSchema = z.object({
  email: authSchema.shape.email,
})

export type EmailChangeFormData = z.infer<typeof emailChangeSchema>


/** パスワード変更のバリデーション（登録時と同じ条件を使う） */
export const passwordChangeSchema = z
  .object({
    password: authSchema.shape.password, 
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  })

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>
