import { type Unit as PrismaUnit } from "@prisma/client";
import { z } from "zod"


/** 規格単位の型 */
export type Unit = PrismaUnit


// --------------------------
//  GET: 規格単位一覧の取得
//---------------------------

/** 規格単位一覧取得のレスポンス型 */
export type GetUnitsResponse = {
  units: Unit[]
}

// --------------------------
//  POST: 規格単位の新規作成
//---------------------------

/** 規格単位フォーム(新規・編集共通)のスキーマ */
export const unitSchema = z.object({
  name: z.string().min(1, "単位名は必須です"),
})

/** zodスキーマから変換した型 */
export type UnitFormData = z.infer<typeof unitSchema>


/** 規格単位作成のAPIリクエスト型 */
export type CreateUnitRequest = UnitFormData

/** 規格単位作成のAPIレスポンス型 */
export type CreateUnitResponse = {
  message: string
  data: Unit
}


// --------------------------
//  PUT: 規格単位の更新
//---------------------------

/** 規格単位更新のAPIリクエスト型 */
export type UpdateUnitRequest = UnitFormData

/** 規格単位更新のAPIレスポンス型 */
export type UpdateUnitResponse = {
  message: string
  data: Unit
}