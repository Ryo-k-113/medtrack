import { type Unit as PrismaUnit } from "@prisma/client";



/** 規格単位の型 */
export type Unit = PrismaUnit


// --------------------------
//  GET: 規格単位一覧の取得
//---------------------------

/** 規格単位一覧取得のレスポンス型 */
export type GetUnitsResponse = {
  units: Unit[]
}

