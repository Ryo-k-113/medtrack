import { createColumnHelper } from "@tanstack/react-table"
import { BatchJobStatusBadge } from "@/components/Badge/BatchJobStatusBadge"
import { formatDateTime } from "@/utils/format"
import { BatchErrorMessage } from "./BatchErrorMessage"
import { BATCH_JOB_TYPE_LABEL } from "@/constants/batch"
import type { BatchLog } from "@/types/admin/batch"

const columnHelper = createColumnHelper<BatchLog>()

// 実行履歴のテーブル項目
export const BatchLogColumns = [
  columnHelper.accessor("jobType", {
    header: "処理名",
    size: 120,
    cell: (info) => BATCH_JOB_TYPE_LABEL[info.getValue()],
  }),
  columnHelper.accessor("startedAt", {
    header: "実行日時",
    size: 140,
    cell: (info) => formatDateTime(info.getValue()),
  }),
  columnHelper.accessor("completedAt", {
    header: "完了日時",
    size: 140,
    cell: (info) => formatDateTime(info.getValue()) ?? <span className="text-weak">ー</span>,
  }),
  columnHelper.accessor("status", {
    header: "結果",
    size: 80,
    cell: (info) => <BatchJobStatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor("processedCount", {
    header: () => <span className="block w-full text-right">処理件数</span>,
    size: 80,
    cell: (info) => <div className="text-right">{info.getValue()}件</div>,
  }),
  columnHelper.accessor("errorMessage", {
    header: "エラー詳細",
    size: 240,
    cell: (info) => (
      <BatchErrorMessage
        errorCode={info.row.original.errorCode}
        errorMessage={info.getValue()}
        failedAt={info.row.original.failedAt}
      />
    ),
  }),
]
