import type { BatchJobType, BatchJobStatus } from "@prisma/client"

/** 定期実行の処理履歴 */
export type BatchLog = {
  id: number
  jobType: BatchJobType
  status: BatchJobStatus
  processedCount: number

  // Date型をstringへ変換
  startedAt: string
  completedAt: string | null
  failedAt: string | null

  // 失敗時のみ記録される（エラーコードとメッセージ）
  errorCode: string | null
  errorMessage: string | null
}


/** 実行履歴取得のレスポンス型 */
export type GetBatchLogsResponse = {
  logs: BatchLog[]
  totalCount: number
}

/** 定期実行のレスポンス型（Vercelの実行ログで確認する） */
export type CronBatchResponse = {
  message: string
  processedCount: number
  errorCode: string | null
  errorMessage: string | null
}

/** 手動実行のレスポンス型 */
export type RunBatchResponse = {
  message: string
  log: BatchLog
}


