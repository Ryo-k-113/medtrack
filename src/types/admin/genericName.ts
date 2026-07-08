import { type GenericName as PrismaGenericName } from "@prisma/client"


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

/** 成分名作成のAPIリクエスト型 */
export type CreateGenericNameRequest = {
  name: string
}

/** 成分名作成のAPIレスポンス型 */
export type CreateGenericNameResponse = {
  message: string
  data: GenericName
}


// --------------------------
//  PUT: 成分名の更新
//---------------------------

/** 成分名更新のAPIリクエスト型 */
export type UpdateGenericNameRequest = {
  name: string
}

/** 成分名更新のAPIレスポンス型 */
export type UpdateGenericNameResponse = {
  message: string
  data: GenericName
}

