import type { CurrentShippingStatus } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { STATUS_ICON } from "@/constants/statusChip"

type ShippingStatusBadgeProps = {
  status: CurrentShippingStatus
  className?: string
}

const SHIPPING_STATUS_MAP: Record<CurrentShippingStatus, { label: string; className: string }> = {
  NORMAL_SHIPMENT: {
    label: "通常出荷",
    className: "bg-status-normal text-status-normal-foreground hover:bg-status-normal",
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
    className: "bg-status-discontinued text-status-discontinued-foreground hover:bg-status-discontinued",
  },
}

export const ShippingStatusBadge = ({
  status,
  className,
}: ShippingStatusBadgeProps) => {
  const { label, className: statusClassName } = SHIPPING_STATUS_MAP[status]
  // 告知種別のバッジ・出荷状況の絞り込みと共通のアイコン
  const Icon = STATUS_ICON[status]

  return (
    <Badge className={cn("gap-1 whitespace-nowrap py-1", statusClassName, className)}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {label}
    </Badge>
  )
}