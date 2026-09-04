"use client"

import { useDataFetch } from "@/hooks/useDataFetch"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import type { BookmarksResponse } from "@/types/bookmark"


/**
 * ブックマーク医薬品の一覧を取得するカスタムフック(マイページ用)
 * @returns 医薬品一覧、ローディング状態、エラー、状態更新関数
 */

export const useBookmarkedDrugs = () => {
  const { session } = useSupabaseSession()

  // 未ログイン時はリクエストしない
  const { data, isLoading, error, mutate } = useDataFetch<BookmarksResponse>(
    session ? "/api/bookmarks" : null
  )

  return {
    drugs: data?.drugs ?? [],
    isLoading,
    error,
    mutate,
  }
}
