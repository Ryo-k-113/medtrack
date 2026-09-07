"use client"

import { AlertCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { SectionCard } from "@/components/Card/SectionCard"
import { BatchJobStatusBadge } from "@/components/Badge/BatchJobStatusBadge"
import { BatchErrorMessage } from "./BatchErrorMessage"
import { formatDateTime } from "@/utils/format"
import { STUCK_RUNNING_MINUTES, STALE_LAST_RUN_HOURS } from "@/constants/batch"
import type { BatchLog } from "@/types/admin/batch"

type BatchJobCardProps = {
  title: string
  latestLog: BatchLog | null
  isLoading: boolean
}

// 定期実行ジョブの最新状況を表示するカード
export const BatchJobCard = ({
  title,
  latestLog,
  isLoading,
}: BatchJobCardProps) => {
  const elapsedMs = latestLog
    ? Date.now() - new Date(latestLog.startedAt).getTime()
    : 0

  // 実行中のまま滞留
  const isStuck =
    latestLog?.status === "RUNNING" &&
    elapsedMs > STUCK_RUNNING_MINUTES * 60 * 1000

  // 最終実行が古く定期実行が行われていない可能性
  const isStale = !!latestLog && elapsedMs > STALE_LAST_RUN_HOURS * 60 * 60 * 1000

  return (
    <SectionCard>
      {/* 上段：ジョブ名・ステータス */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{title}</h3>
          { latestLog && <BatchJobStatusBadge status={latestLog.status} />
          }
        </div>

      </div>

      {/* 下段：最新の実行結果 */}
      {!latestLog ? (
        <p className="mt-4 text-sm text-weak">まだ実行されていません。</p>
      ) : (
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex gap-4">
            <dt className="w-20 shrink-0 text-weak">最終実行</dt>
            <dd>{formatDateTime(latestLog.startedAt)}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-20 shrink-0 text-weak">処理件数</dt>
            <dd>{latestLog.processedCount}件</dd>
          </div>
          {latestLog.completedAt && (
            <div className="flex gap-4">
              <dt className="w-20 shrink-0 text-weak">完了日時</dt>
              <dd>{formatDateTime(latestLog.completedAt)}</dd>
            </div>
          )}
        </dl>
      )}

      {/* 定期実行が正常に回っていない可能性の警告（滞留を優先して表示する） */}
      {(isStuck || isStale) && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-status-limited-foreground/30 bg-status-limited/30 p-3 text-sm text-status-limited-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            {isStuck
              ? `実行中のまま${STUCK_RUNNING_MINUTES}分以上経過しています。処理が中断された可能性があります。`
              : `${STALE_LAST_RUN_HOURS}時間以上実行されていません。定期実行が動作していない可能性があります。`}
          </p>
        </div>
      )}

      {/* エラー内容 */}
      {latestLog?.errorMessage && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <BatchErrorMessage
            errorCode={latestLog.errorCode}
            errorMessage={latestLog.errorMessage}
            failedAt={latestLog.failedAt}
            className="min-w-0 flex-1"
          />
        </div>
      )}
    </SectionCard>
  )
}
