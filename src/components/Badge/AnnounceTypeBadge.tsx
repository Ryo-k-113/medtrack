import type { AnnounceType } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type AnnounceTypeBadgeProps = {
  status: AnnounceType
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
  className,
}: AnnounceTypeBadgeProps) => {
  const { label, className: statusClassName } = ANNOUNCE_TYPE_MAP[status]

  return (
    <Badge className={cn("py-1", statusClassName, className)}>
      {label}
    </Badge>
  )
}