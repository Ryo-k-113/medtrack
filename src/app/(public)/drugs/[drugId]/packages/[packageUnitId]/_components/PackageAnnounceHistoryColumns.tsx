import { createColumnHelper } from "@tanstack/react-table"
import { formatDate } from "@/utils/format"
import { AnnounceTypeBadge } from "@/components/Badge/AnnounceTypeBadge"
import type { PackageDetailResult } from "@/types/package"

type AnnounceHistoryItem = PackageDetailResult["AnnounceHistories"][number]

const columnHelper = createColumnHelper<AnnounceHistoryItem>()

// 告知履歴の一覧表示項目
export const PackageAnnounceHistoryColumns = [
  columnHelper.accessor("announcedDate", {
    header: "告知日",
    size: 80,
    cell: (info) => (
      <span className="text-sm">{formatDate(info.getValue()) ?? "-"}</span>
    ),
  }),

  columnHelper.accessor("effectiveDate", {
    header: "適用日",
    size: 80,
    cell: (info) => (
      <span className="text-sm">{formatDate(info.getValue()) ?? "-"}</span>
    ),
  }),

  columnHelper.accessor("announceType", {
    header: "種別",
    size: 320,
    cell: (info) => {
      const announceType = info.getValue()
      return announceType
        ? <AnnounceTypeBadge status={announceType} className="rounded-md" />
        : "-"
    },
  }),
]
