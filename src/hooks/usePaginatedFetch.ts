"use client"

import { useDataFetch } from "@/hooks/useDataFetch"


type PaginatedFetchParams = {
  page: number
  limit: number
  search: string
}

/**
 * offsetページネーション（page / limit / search）に対応したAPIエンドポイントからデータを取得する汎用カスタムフック
 * パラメーターの持ち方（URLクエリ・コンポーネントの状態）は呼び出し側で決める
 * @param baseUrl - APIエンドポイントパス（page・limit・searchクエリを付与して呼び出す）
 * @param params - ページ番号・表示件数・検索キーワード
 * @returns レスポンスデータ、総件数、ページ数、ローディング状態、エラー、データ再取得関数
 */
export const usePaginatedFetch = <T extends { totalCount?: number }>(
  baseUrl: string,
  { page, limit, search }: PaginatedFetchParams
) => {
  // クエリパラメータの組み立て
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search && { search }),
  })

  // データ取得
  const { data, isLoading, error, mutate } = useDataFetch<T>(
    `${baseUrl}?${query.toString()}`
  )

  // データ件数の取得
  const totalCount = data?.totalCount ?? 0

  // 表示件数からページ数を算出
  const totalPages = Math.max(1, Math.ceil(totalCount / limit))

  return { 
    data, 
    totalCount, 
    totalPages, 
    isLoading, 
    error, 
    mutate }
}
