import { z } from "zod"


//** 製薬会社フォーム(新規・編集共通)のスキーマ */
export const companyFormSchema = z.object({
  name: z.string().min(1, "会社名は必須です"),
})


//** 新規・編集で共通の型 */
export type CompanyFormData = z.infer<typeof companyFormSchema>

