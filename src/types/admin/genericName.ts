import { type GenericName as PrismaGenericName } from "@prisma/client"
import { z } from "zod"


/** 成分名の基本型 */
export type GenericName = PrismaGenericName


// --------------------------
//  GET: 成分名一覧の取得
//---------------------------

/** 成分名一覧取得のレスポンス型 */
export type GetGenericNamesResponse = {
  genericNames: GenericName[]
}


// --------------------------
//  POST: 成分名の新規作成
//---------------------------

//** 成分名フォーム(新規・編集共通)のスキーマ */
export const genericNameFormSchema = z.object({
  name: z.string().min(1, "会社名は必須です"),
})

/** zodスキーマから変換した型 */
export type GenericNameFormData = z.infer<typeof genericNameFormSchema>


/** 成分名作成のAPIリクエスト型 */
export type CreateGenericNameRequest = GenericNameFormData


/** 成分名作成のAPIレスポンス型 */
export type CreateGenericNameResponse = {
  message: string
  data: GenericName
}


// --------------------------
//  PUT: 成分名の更新
//---------------------------

/** 成分名更新のAPIリクエスト型 */
export type UpdateGenericNameRequest = GenericNameFormData


/** 成分名更新のAPIレスポンス型 */
export type UpdateGenericNameResponse = {
  message: string
  data: GenericName
}

