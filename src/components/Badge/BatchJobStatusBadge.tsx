import type { BatchJobStatus } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type BatchJobStatusBadgeProps = {
  status: BatchJobStatus
  className?: string
}

const BATCH_JOB_STATUS_MAP: Record<BatchJobStatus, { label: string; className: string }> = {
  RUNNING: {
    label: "実行中",
    className: "border-border bg-surface text-weak hover:bg-surface",
  },
  COMPLETED: {
    label: "完了",
    className:
      "border-status-normal bg-status-normal/20 text-status-normal-foreground hover:bg-status-normal/20",
  },
  FAILED: {
    label: "失敗",
    className:
      "border-status-stop/50 bg-status-stop/30 text-destructive hover:bg-status-stop/20",
  },
}

// 定期実行の実行結果を表示するバッジ
export const BatchJobStatusBadge = ({ status, className }: BatchJobStatusBadgeProps) => {
  const { label, className: statusClassName } = BATCH_JOB_STATUS_MAP[status]

  return (
    <Badge className={cn("rounded-md py-1", statusClassName, className)}>
      {label}
    </Badge>
  )
}
