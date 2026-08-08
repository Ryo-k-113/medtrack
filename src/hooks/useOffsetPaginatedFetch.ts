"use client"

import { useState } from "react"
import { useDataFetch } from "@/hooks/useDataFetch"


type UseOffsetPaginatedFetchOptions = {
  initialPage?: number
  initialPageSize?: number
}

/**
 * offsetページネーション（page / limit）に対応したAPIエンドポイントをページ状態の管理ごと取得する汎用カスタムフック
 * PaginationControl・PaginationPageSize（OffsetPagination）と組み合わせて使用する
 * @param baseUrl - APIエンドポイントパス（page・limitクエリを付与して呼び出す）
 * @returns レスポンスデータ、ページ情報、ローディング状態、エラー、データ再取得関数、ページ操作関数
 */

export const useOffsetPaginatedFetch = <T extends { totalCount?: number }>(
  baseUrl: string,
  { initialPage = 1, initialPageSize = 10 }: UseOffsetPaginatedFetchOptions = {}
) => {
  // ページ情報、ページあたりの表示件数の状態管理
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  // データ取得
  const { data, isLoading, error, mutate } = useDataFetch<T>(
    `${baseUrl}?page=${page}&limit=${pageSize}`
  )

  // データ件数の取得
  const totalCount = data?.totalCount ?? 0

  // 表示件数からページ数を算出
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))


  // 表示件数の変更（表示件数が変わったら1ページ目に戻す）
  const changePageSize = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
  }

  // ページの変更
  const changePage = (newPage: number) => {
    setPage(newPage)
  }

  return {
    data,
    page,
    pageSize,
    totalPages,
    isLoading,
    error,
    mutate,
    changePage,
    changePageSize,
  }
}
