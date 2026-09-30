"use client"

import { useQueryStates, parseAsInteger, parseAsString } from "nuqs"
import { usePaginatedFetch } from "@/hooks/usePaginatedFetch"


type UseOffsetPaginatedFetchOptions = {
  initialPage?: number
  initialPageSize?: number
}

/**
 * offsetページネーション（page / limit / search）に対応したAPIエンドポイントから、nuqsを用いてURLクエリパラメーターと同期しながらデータを取得する汎用カスタムフック
 * PaginationControl・PaginationPageSize（OffsetPagination）と組み合わせて使用する
 * @param baseUrl - APIエンドポイントパス（page・limitクエリを付与して呼び出す）
 * @returns レスポンスデータ、ページ情報、ローディング状態、エラー、データ再取得関数、ページ操作関数
 */

export const useOffsetPaginatedFetch = <T extends { totalCount?: number }>(
  baseUrl: string,
  { initialPage = 1, initialPageSize = 10 }: UseOffsetPaginatedFetchOptions = {}
) => {
   // nuqsでURLクエリパラメータを管理 
   const [params, setParams] = useQueryStates({
    page:   parseAsInteger.withDefault(initialPage),
    limit:  parseAsInteger.withDefault(initialPageSize),
    search: parseAsString.withDefault(""),
  })

  const { page, limit: pageSize, search } = params

  // データ取得（URLクエリの値で取得する）
  const { data, totalPages, isLoading, error, mutate } = usePaginatedFetch<T>(baseUrl, {
    page,
    limit: pageSize,
    search,
  })


  // 表示件数の変更（表示件数が変わったら1ページ目に戻す）
  const changePageSize = (newPageSize: number) => {
    setParams({ limit: newPageSize, page: 1 })
  }

  // ページの変更
  const changePage = (newPage: number) => {
    setParams({ page: newPage })
  }

  // 検索キーワードの変更（検索したら1ページ目に戻す）
  const changeSearch = (newSearch: string) => {
    setParams({ search: newSearch, page: 1 })
  }

  return {
    data,
    page,
    pageSize,
    totalPages,
    search,
    isLoading,
    error,
    mutate,
    changePage,
    changePageSize,
    changeSearch,
  }
}
