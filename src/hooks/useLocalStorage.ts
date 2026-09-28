"use client"

import { useCallback, useSyncExternalStore } from "react"

/** 同じタブ内で書き込んだことを知らせるイベント（storage イベントは他のタブでしか起きないため） */
const LOCAL_STORAGE_EVENT = "local-storage-change"

/** 保存できなかった値（ブラウザの設定で保存領域を使えない場合に、ページを開いている間だけ使う） */
const fallbackValues = new Map<string, string>()

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange)
  window.addEventListener(LOCAL_STORAGE_EVENT, onChange)
  return () => {
    window.removeEventListener("storage", onChange)
    window.removeEventListener(LOCAL_STORAGE_EVENT, onChange)
  }
}

const readValue = (key: string): string | null => {
  if (fallbackValues.has(key)) return fallbackValues.get(key) ?? null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

/**
 * 端末に保存した文字列を読み書きする
 * サーバーでの描画と最初の描画（hydration）では serverValue を使い、その後に保存値へ切り替える
 * @param key - localStorage のキー
 * @param serverValue - 保存値を読めないサーバー側で使う値
 * @returns [保存値（無ければ null）, 保存する関数]
 */
export const useLocalStorage = (key: string, serverValue: string | null = null) => {
  const value = useSyncExternalStore(
    subscribe,
    () => readValue(key),
    () => serverValue
  )

  const setValue = useCallback(
    (next: string) => {
      try {
        localStorage.setItem(key, next)
      } catch {
        // 保存できない場合は、このページを開いている間だけ反映する
        fallbackValues.set(key, next)
      }
      window.dispatchEvent(new Event(LOCAL_STORAGE_EVENT))
    },
    [key]
  )

  return [value, setValue] as const
}
