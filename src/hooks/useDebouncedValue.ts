import { useEffect, useState } from "react"

/**
 * 値の変更を一定時間待ってから反映する
 * @param value - 監視する値
 * @param delayMs - 反映までの待ち時間（ミリ秒）
 * @returns 最後の変更から delayMs 経過した時点の値
 */
export const useDebouncedValue = <T>(value: T, delayMs = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
     // delayMs後に最新の値を反映する
    const timer = setTimeout(() => setDebouncedValue(value), delayMs)
    // delayMsが経過する前に値が変わったら、前回の更新予約を消す。
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debouncedValue
}
