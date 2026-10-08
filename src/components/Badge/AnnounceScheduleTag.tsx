import type { AnnounceType } from "@prisma/client"
import { STATUS_CHIP_CLASS, STATUS_ICON } from "@/constants/statusChip"
import { cn } from "@/lib/utils"

type AnnounceScheduleTagProps = {
  announceType: AnnounceType
  /** 時期の表示（「2026年12月1日〜」「在庫消尽後・2026年12月頃」など） */
  dateLabel: string
  className?: string
}

/** 告知種別の表示名 */
const ANNOUNCE_TYPE_LABEL: Record<AnnounceType, string> = {
  NORMAL_SHIPMENT: "通常出荷",
  LIMITED_SHIPMENT: "限定出荷",
  SHIPMENT_SUSPENDED: "出荷停止",
  DISCONTINUED_SALE: "販売中止",
  TRANSFER_OF_SALE: "販売移管",
}

/**
 * 包装の予定（販売移管・販売中止など）を表すタグ
 * 現在の出荷状況のバッジと見分けられるよう、種別と時期を1つの枠にまとめる
 */
export const AnnounceScheduleTag = ({ announceType, dateLabel, className }: AnnounceScheduleTagProps) => {
  // 出荷状況の絞り込み・包装チップと共通のアイコン
  const Icon = STATUS_ICON[announceType]

  return (
    <span
      className={cn(
        // モバイルは行として並べるため文字で表示、sm以上はTagで表示
        "inline-flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-medium text-foreground sm:flex-nowrap",
        "sm:rounded-lg sm:border sm:bg-surface sm:p-1 sm:pr-2.5",
        className
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1 whitespace-nowrap rounded border px-1.5 py-px font-semibold",
          STATUS_CHIP_CLASS[announceType]
        )}
      >
        <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
        {ANNOUNCE_TYPE_LABEL[announceType]}
      </span>
      <span className="whitespace-nowrap">{dateLabel}</span>
    </span>
  )
}
