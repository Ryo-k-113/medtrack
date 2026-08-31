"use client"

import { useState } from "react"
import { useDataFetch } from "@/hooks/useDataFetch"
import type { SearchDrugsResponse } from "@/types/search"

const DEFAULT_PAGE_SIZE = 10

/**
 * キーワード単位で医薬品を検索するカスタムフック（offsetページネーション対応）
 * 複数キーワードのタブを同時に扱えるよう、ページ状態はURLクエリではなくフック内に保持する
 * @param keyword - 検索キーワード（空文字の場合は結果を取得しない）
 * @returns 検索結果、ページ情報、ローディング状態、エラー、ページ操作関数
 */
export const useDrugSearch = (keyword: string) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const query = new URLSearchParams({
    keyword,
    page: String(page), 
    limit: String(pageSize),
  })

  const { data, isLoading, error } = useDataFetch<SearchDrugsResponse>(
    keyword ? `/api/drugs/search?${query.toString()}` : null
  )

  const totalCount = data?.totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  // ページの変更
  const changePage = (newPage: number) => {
    setPage(newPage)
  }

  // 表示件数の変更（表示件数が変わったら1ページ目に戻す）
  const changePageSize = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
  }

  return {
    drugs: data?.drugs ?? [],
    totalCount,
    page,
    pageSize,
    totalPages,
    isLoading: keyword ? isLoading : false, 
    error: keyword ? error : null,
    changePage,
    changePageSize,
  }
}
