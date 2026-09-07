"use client"

import type { BatchJobType } from "@prisma/client"
import { useDataFetch } from "@/hooks/useDataFetch"
import { BATCH_LOGS_API_PATH } from "@/constants/batch"
import type { GetBatchLogsResponse } from "@/types/admin/batch"

/**
 * 指定した処理の最新の実行結果を取得するカスタムフック
 * @param jobType - 対象の処理
 * @returns 最新の実行結果、ローディング状態
 */
export const useLatestBatchLog = (jobType: BatchJobType) => {
  const { data, isLoading } = useDataFetch<GetBatchLogsResponse>(
    `${BATCH_LOGS_API_PATH}?jobType=${jobType}&limit=1`
  )

  return {
    latestLog: data?.logs[0] ?? null,
    isLoading,
  }
}
