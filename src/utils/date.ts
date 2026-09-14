import { TZDate } from "@date-fns/tz"

/** アプリで日付を扱う基準のタイムゾーン */
export const APP_TIME_ZONE = "Asia/Tokyo"

/**
 * 日本時間での日付を取り出し、UTCの0時として変換
 * 実行環境のタイムゾーンに依存しない
 */
export const toUTCDate = (date: string | null | undefined): Date | null => {
  if (!date) return null

  const jst = new TZDate(date, APP_TIME_ZONE)
  if (Number.isNaN(jst.getTime())) return null

  return new Date(Date.UTC(
    jst.getFullYear(), 
    jst.getMonth(), 
    jst.getDate())
  )
}

/**
 * 日本時間の「今日」の日付を、UTCの0時として比較用の共通形式に変換
 * （日本時間の日付だけで判定できる）
 */
export const getJstToday = (): Date => {
  const jstNow = TZDate.tz(APP_TIME_ZONE)

  return new Date(Date.UTC(
    jstNow.getFullYear(), 
    jstNow.getMonth(), 
    jstNow.getDate())
  )
}
