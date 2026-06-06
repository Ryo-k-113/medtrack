import type { CurrentShippingStatus } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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
}

export const ShippingStatusBadge = ({
  status,
  className,
}: ShippingStatusBadgeProps) => {
  const { label, className: statusClassName } = SHIPPING_STATUS_MAP[status]

  return (
    <Badge className={cn("py-1",statusClassName, className)}>
      {label}
    </Badge>
  )
}