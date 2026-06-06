import type { PublishStatus } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type PublishStatusBadgeProps = {
  status: PublishStatus
  className?: string
}

const PUBLISH_STATUS_MAP: Record<PublishStatus, { label: string; className: string }> = {
  PUBLISHED: {
    label: "公開",
    className: "px-4 bg-accent text-accent-foreground hover:bg-accent",
  },
  DRAFT: {
    label: "下書き",
    className: "bg-slate-200 text-foreground hover:bg-slate-200",
  },
}

export const PublishStatusBadge = ({
  status,
  className,
}: PublishStatusBadgeProps) => {
  const { label, className: statusClassName } = PUBLISH_STATUS_MAP[status]

  return (
    <Badge className={cn(statusClassName, className)}>
      {label}
    </Badge>
  )
}