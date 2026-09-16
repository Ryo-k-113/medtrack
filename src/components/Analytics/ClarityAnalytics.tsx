"use client"

import { useEffect } from "react"
import Clarity from "@microsoft/clarity"

/** ClarityのプロジェクトID */
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID

/**
 * Microsoft Clarityの計測を開始する
 * セッション記録の対象は公開ページ
 */
export const ClarityAnalytics = () => {
  useEffect(() => {
    if (!CLARITY_ID) return

    Clarity.init(CLARITY_ID)
  }, [])

  return null
}
