import { PharmaceuticalCompany } from "@prisma/client";
import { z } from "zod"


/** 製薬会社の型 */
export type Company = PharmaceuticalCompany


// --------------------------
//  GET: 製薬会社一覧の取得
//---------------------------

/** 製薬会社一覧取得のレスポンス型 */
export type GetCompaniesResponse = {
  companies: Company[]
}


// --------------------------
//  POST: 製薬会社の新規作成
//---------------------------

//** 製薬会社フォーム(新規・編集共通)のスキーマ */
export const companyFormSchema = z.object({
  name: z.string().min(1, "会社名は必須です"),
})

/** zodスキーマから変換した型 */
export type CompanyFormData = z.infer<typeof companyFormSchema>


/** 製薬会社作成のAPIリクエスト型 */
export type CreateCompanyRequest = CompanyFormData

/** 製薬会社作成のAPIレスポンス型 */
export type CreateCompanyResponse = {
  message: string
  data: Company
}


// --------------------------
//  PUT: 製薬会社の更新
//---------------------------

/** 製薬会社作成のAPIリクエスト型 */
export type UpdateCompanyRequest = CompanyFormData

/** 製薬会社更新のAPIレスポンス型 */
export type UpdateCompanyResponse = {
  message: string
  data: Company
}

