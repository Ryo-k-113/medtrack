"use client"

import { useOffsetPaginatedFetch } from "@/hooks/useOffsetPaginatedFetch"
import { BATCH_LOGS_API_PATH } from "@/constants/batch"
import type { GetBatchLogsResponse } from "@/types/admin/batch"

/**
 * 定期実行の履歴を取得するカスタムフック
 * 全処理の履歴をまとめて表示するため、処理の絞り込みは行わない
 * @returns 実行履歴、ローディング状態、エラー、ページ操作関数
 */
export const useAdminBatchLogs = () => {
  const {
    data,
    page,
    pageSize,
    totalPages,
    isLoading,
    error,
    changePage,
    changePageSize,
  } = useOffsetPaginatedFetch<GetBatchLogsResponse>(BATCH_LOGS_API_PATH)

  return {
    logs: data?.logs ?? [],
    page,
    pageSize,
    totalPages,
    isLoading,
    error,
    changePage,
    changePageSize,
  }
}
