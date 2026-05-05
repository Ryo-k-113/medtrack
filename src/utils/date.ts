
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
