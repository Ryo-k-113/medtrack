"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { EyeOff, Pencil, PencilOff } from "lucide-react"
import { formatDate } from "@/utils/format"
import { AnnounceTypeBadge } from "@/components/Badge/AnnounceTypeBadge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ShippingAnnouncement } from "@/types/drug"

type ColumnsProps = {
  onEdit: (history: ShippingAnnouncement) => void
  onInactivate: (id: number) => void
}

// 編集可能か判定
const isEditable = (history: ShippingAnnouncement): boolean =>
  history.publishStatus !== "INACTIVE" &&
  history.processStatus === "PENDING"

// 非表示化可能か判定 (COMPLETEかつ非表示以外)
const canInactivate = (history: ShippingAnnouncement): boolean =>
  history.publishStatus !== "INACTIVE" &&
  history.processStatus === "COMPLETED"

const columnHelper = createColumnHelper<ShippingAnnouncement>()

// 一覧表示のテーブル項目
export const AnnounceHistoryColumns = ({
  onEdit,
  onInactivate,
}: ColumnsProps) => [
  columnHelper.accessor("announcedDate", {
    header: "告示日",
    cell: (info) => {
      const isInactive = info.row.original.publishStatus === "INACTIVE"
      return (
        <span className={cn("text-sm", isInactive && "line-through text-weak")}>
          {formatDate(info.getValue()) ?? "-"}
        </span>
      )
    },
  }),

  columnHelper.accessor("effectiveDate", {
    header: "適用日",
    cell: (info) => {
      const isInactive = info.row.original.publishStatus === "INACTIVE"
      return (
        <span className={cn("text-sm", isInactive && "line-through text-weak")}>
          {formatDate(info.getValue()) ?? "-"}
        </span>
      )
    },
  }),

  columnHelper.accessor("announceType", {
    header: "種別",
    cell: (info) => {
      const announceType = info.getValue()
      const isInactive = info.row.original.publishStatus === "INACTIVE"
      return announceType ? (
        <AnnounceTypeBadge
          status={announceType}
          inactive={isInactive}
          className="rounded-md"
        />
      ) : "-"
    },
  }),

  columnHelper.display({
    id: "edit",
    header: "編集",
    cell: ({ row }) => {
      const canEdit = isEditable(row.original)
      return (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canEdit}
          onClick={() => onEdit(row.original)}
        >
          {canEdit ? <Pencil className="h-4 w-4" /> : <PencilOff className="h-4 w-4" />}
          {canEdit ? "編集" : "編集不可"}
        </Button>
      )
    },
  }),

  columnHelper.display({
    id: "inactivate",
    header: "非表示 / ステータス",
    cell: ({ row }) => {
      const isInactive = row.original.publishStatus === "INACTIVE"

      if (isInactive) {
        return (
          <span className="flex items-center gap-1.5 text-sm text-weak">
            <EyeOff className="h-4 w-4" />
            非表示済み
          </span>
        )
      }

      if (canInactivate(row.original)) {
        return (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onInactivate(row.original.id)}
          >
            <EyeOff className="h-4 w-4" />
            非表示
          </Button>
        )
      }

      return null
    },
  }),
]
