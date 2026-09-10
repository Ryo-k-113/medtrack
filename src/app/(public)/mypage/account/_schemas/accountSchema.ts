import { z } from "zod"
import { emailSchema, passwordSchema } from "@/types/auth"

/** メールアドレス変更のバリデーション（登録時と同じ条件を使う） */
export const emailChangeSchema = z.object({
  email: emailSchema,
})

export type EmailChangeFormData = z.infer<typeof emailChangeSchema>


/** パスワード変更のバリデーション（登録時と同じ条件を使う） */
export const passwordChangeSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  })

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>
