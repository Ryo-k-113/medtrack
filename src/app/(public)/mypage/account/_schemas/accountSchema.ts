import { z } from "zod"
import { authSchema } from "@/app/(public)/(auth)/_schemas/authSchema"

/** メールアドレス変更のバリデーション（登録時と同じ条件を使う） */
export const emailChangeSchema = z.object({
  email: authSchema.shape.email,
})

export type EmailChangeFormData = z.infer<typeof emailChangeSchema>



