"use client"

import { useDataFetch } from "@/hooks/useDataFetch"
import { useMe } from "@/hooks/useMe"
import type { BookmarksResponse } from "@/types/bookmark"


/**
 * ブックマーク医薬品の一覧を取得するカスタムフック(マイページ用)
 * @returns 医薬品一覧、ローディング状態、エラー、状態更新関数
 */

export const useBookmarkedDrugs = () => {
  const { isLoggedIn } = useMe()

  // 未ログイン時はリクエストしない
  const { data, isLoading, error, mutate } = useDataFetch<BookmarksResponse>(
    isLoggedIn ? "/api/me/bookmarks" : null
  )

  return {
    drugs: data?.drugs ?? [],
    isLoading,
    error,
    mutate,
  }
}
