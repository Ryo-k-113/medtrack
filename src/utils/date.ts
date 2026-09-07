
//JSTの日付をUTCとして扱う
export const toUTCDate = (date: string | null | undefined): Date | null => {
  if (!date) return null
  const d = new Date(date)
  return new Date(Date.UTC(
    d.getFullYear(),
    d.getMonth(),
    d.getDate()
  ))
}

/** 日本時間との時差 */
const JST_OFFSET_MS = 9 * 60 * 60 * 1000

/**
 * 日本時間の「今日」の日付を、UTCの0時として比較用の共通形式に変換
 * （日本時間の日付だけで判定できる）
 */
export const getJstToday = (): Date => {
  const jstNow = new Date(Date.now() + JST_OFFSET_MS)

  return new Date(Date.UTC(
    jstNow.getUTCFullYear(),
    jstNow.getUTCMonth(),
    jstNow.getUTCDate()
  ))
}
