import * as React from "react"

const MOBILE_BREAKPOINT = 768

/** モバイル幅かを判定するメディアクエリ */
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

/**
 * モバイル幅かどうか（shadcn/ui のフック）
 * 画面幅の変化を useSyncExternalStore で購読し、effect の中で状態を書き換えないようにする
 * （サーバーと最初の描画では、これまでどおり false）
 */
export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false
  )
}
