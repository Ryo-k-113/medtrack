"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useMe } from "@/hooks/useMe"

/** 閉じた状態を保持するキー */
const DISMISSED_KEY = "BannerDismissed"

/** ブラウザの設定で保存領域を使えない場合があるため、失敗しても表示を妨げない */
const readDismissed = () => {
  try {
    return localStorage.getItem(DISMISSED_KEY) === "true"
  } catch {
    return false
  }
}

const saveDismissed = () => {
  try {
    localStorage.setItem(DISMISSED_KEY, "true")
  } catch {
    // 保存できない場合は、このページを開いている間だけ非表示にする
  }
}

/**
 * Topページのバナー
 * ログイン中は表示せず、閉じた状態は端末に保存する
 */
export const TopBanner = () => {
  const { isLoggedIn, isLoading } = useMe()

  // localStorageはサーバーでは読めないため、初期値は非表示にして描画後に反映する
  const [isDismissed, setIsDismissed] = useState(true)

  useEffect(() => {
    setIsDismissed(readDismissed())
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    saveDismissed()
  }

  if (isLoading || isLoggedIn || isDismissed) return null

  return (
    <div className="relative bg-primary/80 px-10 py-4 font-semibold text-center text-xs text-surface md:text-sm">
      アカウント登録すると医薬品の「複数同時検索」や「ブックマーク機能」等が開放されます！
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="お知らせを閉じる"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-surface transition-colors hover:bg-surface  hover:text-primary/80"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
