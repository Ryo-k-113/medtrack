"use client"

import { useEffect, useState } from "react"

/**
 * 現在時刻（ミリ秒）を一定の間隔で更新して返す
 * 描画中に Date.now() を呼ぶと描画のたびに結果が変わるため、時刻は状態として持つ
 * @param intervalMs - 更新する間隔（既定は1分）
 */
export const useNow = (intervalMs = 60 * 1000) => {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])

  return now
}
