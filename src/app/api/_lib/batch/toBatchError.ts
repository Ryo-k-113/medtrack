import { Prisma } from "@prisma/client"

/** 定期実行の失敗時に記録するエラー情報 */
export type BatchError = {
  code: string  //エラーコード
  message: string //管理者向けの説明文
}


/** エラコードと対応文 */
const MESSAGE_BY_ERROR_CODE: Record<string, string> = {
  P2002: "データの重複が発生しました。",
  P2003: "関連するデータが存在しません。",
  P2025: "対象のデータが見つかりませんでした。",
  P2028: "トランザクションの処理に失敗しました。",
  P1001: "データベースに接続できませんでした。",
  P1002: "データベースへの接続がタイムアウトしました。",
  P1008: "データベースの操作がタイムアウトしました。",
  PRISMA_INITIALIZATION_ERROR: "データベースの接続設定に問題があります。",
  PRISMA_VALIDATION_ERROR: "データベースへのリクエスト内容が不正です。",
  PRISMA_UNKNOWN_REQUEST_ERROR: "データベースの処理で不明なエラーが発生しました。",
  INTERRUPTED: "処理が中断されました。",
}

/** 対応する説明文が無いエラーコードに使う */
const DEFAULT_ERROR_MESSAGE = "予期しないエラーが発生しました。"


/** エラーの種類からエラーコードを判定する */
const toErrorCode = (error: unknown): string => {
  // Prismaが原因を特定できたエラー（P2002などのコードを持つ）
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code
  }

  // 接続設定などの初期化エラー（P1001などのコードを持つ場合がある）
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return error.errorCode ?? "PRISMA_INITIALIZATION_ERROR"
  }

  // クエリの組み立てが不正なエラー（コードを持たない）
  if (error instanceof Prisma.PrismaClientValidationError) {
    return "PRISMA_VALIDATION_ERROR"
  }

  // Prisma起因だが原因を特定できなかったエラー
  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return "PRISMA_UNKNOWN_REQUEST_ERROR"
  }

  // 想定外のエラーはエラー名をコードの代わりに使う
  if (error instanceof Error) {
    return error.name || "ERROR"
  }

  return "UNKNOWN_ERROR"
}

/**
 * catchで受け取ったエラーを、記録用のコードと説明文へ変換する
 * @param error - catchで受け取ったエラー
 * @returns エラーコードと説明文
 */
export const toBatchError = (error: unknown): BatchError => {
  const code = toErrorCode(error)

  return { code, message: MESSAGE_BY_ERROR_CODE[code] ?? DEFAULT_ERROR_MESSAGE }
}
