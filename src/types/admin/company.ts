

/** 製薬会社の型 */
export type Company = {
  id: number
  name: string
}


// --------------------------
//  POST: 製薬会社の新規作成
//---------------------------

/** 製薬会社作成のリクエストbody型 */
export type CreateCompanyRequest = {
  name: string
}

/** 製薬会社作成のAPIレスポンス型 */
export type CreateCompanyResponse = {
  message: string
  data: Company
}


// --------------------------
//  PUT: 製薬会社の更新
//---------------------------

/** 製薬会社更新のリクエストbody型 */
export type UpdateCompanyRequest = {
  name: string
}

/** 製薬会社更新のAPIレスポンス型 */
export type UpdateCompanyResponse = {
  message: string
  data: Company
}

