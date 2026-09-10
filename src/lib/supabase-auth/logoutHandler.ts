"use client"

import { mutate as globalMutate } from "swr"
import { toast } from "sonner"
import { fetcher } from "@/utils/fetcher"

/** ログアウト */
export const logoutHandler = async () => {
  try {
    await fetcher({ url: "/api/auth/logout", method: "POST" })

    // 全てのSWRキャッシュを破棄する（再取得はしない）
    await globalMutate(() => true, undefined, { revalidate: false })

    toast.success("ログアウトしました。")

  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "ログアウトに失敗しました"
    )
  }
}
