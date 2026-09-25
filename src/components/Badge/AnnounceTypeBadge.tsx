import type { AnnounceType } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { STATUS_ICON } from "@/constants/statusChip"

type AnnounceTypeBadgeProps = {
  status: AnnounceType
  inactive?: boolean
  className?: string
}

const ANNOUNCE_TYPE_MAP: Record<AnnounceType, { label: string; className: string }> = {
  NORMAL_SHIPMENT: {
    label: "通常出荷",
    className: "bg-status-normal text-status-normal-foreground hover:bg-status-normal ",
  },
  LIMITED_SHIPMENT: {
    label: "限定出荷",
    className: "bg-status-limited text-status-limited-foreground hover:bg-status-limited",
  },
  SHIPMENT_SUSPENDED: {
    label: "出荷停止",
    className: "bg-status-stop text-status-stop-foreground hover:bg-status-stop",
  },
  DISCONTINUED_SALE: {
    label: "販売中止",
    className: "bg-status-discontinued text-status-discontinued-foreground hover:bg-status-discontinued ",
  },
  TRANSFER_OF_SALE: {
    label: "販売移管",
    className: "bg-status-transfer text-status-transfer-foreground hover:bg-status-transfer",
  },
}

export const AnnounceTypeBadge = ({
  status,
  inactive = false,
  className,
}: AnnounceTypeBadgeProps) => {
  const { label, className: statusClassName } = ANNOUNCE_TYPE_MAP[status]
  // 出荷状況の絞り込み・包装チップと共通のアイコン
  const Icon = STATUS_ICON[status]

  return (
    <Badge
      className={cn(
        "shrink-0 gap-1 whitespace-nowrap py-1",
        statusClassName,
        inactive && "opacity-50 line-through",
        className
      )}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {label}
    </Badge>
  )
}