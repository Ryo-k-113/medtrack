"use client"

import { useState } from "react"
import type { ProductType } from "@prisma/client"
import { useDataFetch } from "@/hooks/useDataFetch"
import type { SearchDrugsResponse } from "@/types/search"

const DEFAULT_PAGE_SIZE = 10

/**
 * キーワード単位で医薬品を検索するカスタムフック（offsetページネーション対応）
 * 複数キーワードのタブを同時に扱えるよう、ページ状態はURLクエリではなくフック内に保持する
 * @param keyword - 検索キーワード（空文字の場合は結果を取得しない）
 * @param productTypes - 絞り込む製品区分（空の場合は絞り込まない）
 * @returns 検索結果、ページ情報、ローディング状態、エラー、ページ操作関数
 */
export const useDrugSearch = (keyword: string, productTypes: ProductType[] = []) => {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  // 絞り込み条件が変わったら1ページ目に戻すため、ページ番号は条件とセットで持つ
  const filterKey = [...productTypes].sort().join(",")
  const [pageState, setPageState] = useState({ filterKey, page: 1 })
  const page = pageState.filterKey === filterKey ? pageState.page : 1

  const query = new URLSearchParams({
    keyword,
    page: String(page), 
    limit: String(pageSize),
    ...(filterKey && { productTypes: filterKey }),
  })

  const { data, isLoading, error } = useDataFetch<SearchDrugsResponse>(
    keyword ? `/api/drugs/search?${query.toString()}` : null
  )

  const totalCount = data?.totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  // ページの変更
  const changePage = (newPage: number) => {
    setPageState({ filterKey, page: newPage })
  }

  // 表示件数の変更（表示件数が変わったら1ページ目に戻す）
  const changePageSize = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPageState({ filterKey, page: 1 })
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
