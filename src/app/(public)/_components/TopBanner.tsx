"use client"

import { X } from "lucide-react"
import { useMe } from "@/hooks/useMe"
import { useLocalStorage } from "@/hooks/useLocalStorage"

/** 閉じた状態を保持するキー */
const DISMISSED_KEY = "BannerDismissed"

/**
 * Topページのバナー
 * ログイン中は表示せず、閉じた状態は端末に保存する
 */
export const TopBanner = () => {
  const { isLoggedIn, isLoading } = useMe()

  // localStorageはサーバーでは読めないため、サーバーと最初の描画では非表示にし、その後に保存値を反映する
  const [storedDismissed, setStoredDismissed] = useLocalStorage(DISMISSED_KEY, "true")
  const isDismissed = storedDismissed === "true"

  const handleDismiss = () => {
    setStoredDismissed("true")
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
