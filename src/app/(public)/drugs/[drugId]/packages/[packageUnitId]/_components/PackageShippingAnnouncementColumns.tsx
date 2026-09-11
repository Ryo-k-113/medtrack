import { createColumnHelper } from "@tanstack/react-table"
import { formatDate } from "@/utils/format"
import { AnnounceTypeBadge } from "@/components/Badge/AnnounceTypeBadge"
import type { PackageDetailResult } from "@/types/package"

type ShippingAnnouncementItem = PackageDetailResult["shippingAnnouncements"][number]

type ColumnSizes = {
  announcedDate: number
  effectiveDate: number
  announceType: number
}

const columnHelper = createColumnHelper<ShippingAnnouncementItem>()

/**
 * 列幅（table-fixedのため、合計が表の最小幅になり、広い画面では比率を保って広がる）
 * 各列は内容（日付・バッジ）が収まる幅を下限にしている
 */
const COLUMN_SIZES: Record<"mobile" | "desktop", ColumnSizes> = {
  // 3列を1画面（表の幅 約300px）に収める
  mobile: { announcedDate: 100, effectiveDate: 100, announceType: 100 },
  // 日付を詰めて種別に幅を回す（md幅の表 約650pxに収まる合計にする）
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
      <span className="whitespace-nowrap text-sm">
        {formatDate(info.getValue()) ?? "-"}
      </span>
    ),
  }),

  columnHelper.accessor("announceType", {
    header: () => <span className="whitespace-nowrap">種別</span>,
    size: sizes.announceType,
    cell: (info) => {
      const announceType = info.getValue()
      return announceType
        ? <AnnounceTypeBadge status={announceType} className="rounded-md" />
        : "-"
    },
  }),
]

// 画面幅ごとの列定義（描画のたびに作り直さないよう、ここで確定させる）
export const PackageShippingAnnouncementColumns = {
  mobile: createColumns(COLUMN_SIZES.mobile),
  desktop: createColumns(COLUMN_SIZES.desktop),
}
