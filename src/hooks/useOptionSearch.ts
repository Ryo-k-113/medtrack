"use client"

import { useState } from "react"
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import type { SelectOption } from "@/types/ui/select"

/** 1回の検索で取得する候補の件数（APIの上限） */
const SEARCH_LIMIT = 50

/** コンボボックスに渡す、候補の検索結果と検索操作 */
export type OptionSearch = {
  options: SelectOption[]
  totalCount: number
  isSearching: boolean 
  error: Error | undefined
  changeSearch: (search: string) => void
}

/**
 * 一覧APIを検索して、コンボボックスの候補を取得する汎用カスタムフック
 * 検索キーワードはURLと同期せずコンポーネント内で持つ
 * @param baseUrl - offsetページネーション（page / limit / search）に対応したAPIエンドポイントパス
 * @param toOptions - APIのレスポンスを選択肢に変換する
 * @returns 候補、総件数、検索中の判定、エラー、検索キーワードの変更関数
 */
export const useOptionSearch = <T extends { totalCount: number }>(
  baseUrl: string,
  toOptions: (data: T) => SelectOption[]
): OptionSearch => {
  const [search, setSearch] = useState("")

  // 入力が止まってからAPIを叩く
  const keyword = useDebouncedValue(search)

  const { data, totalCount, isLoading, error } = usePaginatedFetch<T>(baseUrl, {
    page: 1,
    limit: SEARCH_LIMIT,
    search: keyword,
  })

  return {
    options: data ? toOptions(data) : [],
    totalCount,
    isSearching: search !== keyword || isLoading,
    error,
    changeSearch: setSearch,
  }
}
