import { z } from "zod"


//** 製薬会社フォームのベーススキーマ */
export const companyFormSchema = z.object({
  name: z.string().min(1, "会社名は必須です"),
})


//** 新規登録フォームのスキーマ */
export const companyCreateFormSchema = companyFormSchema;

//** 新規登録フォームの型生成 */
export type CompanyCreateFormData = z.infer<typeof companyCreateFormSchema>
