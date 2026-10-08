import { createColumnHelper } from "@tanstack/react-table"
import { formatDate, formatEffectiveDate } from "@/utils/format"
import { AnnounceTypeBadge } from "@/components/Badge/AnnounceTypeBadge"
import { StockDepletionTag } from "@/components/Badge/StockDepletionTag"
import type { PackageDetailResult } from "@/types/package"

type ShippingAnnouncementItem = PackageDetailResult["shippingAnnouncements"][number]

type ColumnSizes = {
  announcedDate: number
  effectiveDate: number
  announceType: number
}

const columnHelper = createColumnHelper<ShippingAnnouncementItem>()

/**
 * 列幅（合計が表の最小幅になり、デスクトップでは比率を保って広がる）
 * 各列は内容（日付・バッジ）が収まる幅を下限にしている
 */
const COLUMN_SIZES: Record<"mobile" | "desktop", ColumnSizes> = {
  mobile: { announcedDate: 88, effectiveDate: 92, announceType: 120 },
  desktop: { announcedDate: 130, effectiveDate: 110, announceType: 400 },
}

// 告知履歴の一覧表示項目
const createColumns = (sizes: ColumnSizes) => [
  columnHelper.accessor("announcedDate", {
    header: () => <span className="whitespace-nowrap md:pl-4">告知日</span>,
    size: sizes.announcedDate,
    cell: (info) => (
      <span className="whitespace-nowrap text-sm md:pl-4">
        {formatDate(info.getValue()) ?? "-"}
      </span>
    ),
  }),

  columnHelper.accessor("effectiveDate", {
    header: () => <span className="whitespace-nowrap">適用日</span>,
    size: sizes.effectiveDate,
    cell: (info) => (
      // 在庫消尽後は「2026年12月頃」（目安が無ければ「在庫消尽次第」）、販売移管は「2026年12月1日〜」と表示
      <span className="text-sm">
        {formatEffectiveDate(info.getValue(), info.row.original) ?? "-"}
      </span>
    ),
  }),

  columnHelper.accessor("announceType", {
    header: () => <span className="whitespace-nowrap">種別</span>,
    size: sizes.announceType,
    cell: (info) => {
      const announceType = info.getValue()
      return announceType ? (
        <div className="flex flex-wrap items-center gap-1">
          <AnnounceTypeBadge status={announceType} className="rounded-md" />
          {info.row.original.isAfterStockDepletion && <StockDepletionTag />}
        </div>
      ) : "-"
    },
  }),
]

// 画面幅ごとの列定義
export const PackageShippingAnnouncementColumns = {
  mobile: createColumns(COLUMN_SIZES.mobile),
  desktop: createColumns(COLUMN_SIZES.desktop),
}
