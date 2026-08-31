import Link from "next/link"
import { Package } from "lucide-react"
import type { CurrentShippingStatus } from "@prisma/client"
import { cn } from "@/lib/utils"

type PackageStatusTagProps = {
  href: string
  label: string
  status: CurrentShippingStatus
  className?: string
}

// 出荷状況による色分け
const STATUS_COLOR_CLASS: Record<CurrentShippingStatus, string> = {
  NORMAL_SHIPMENT: "bg-status-normal text-status-normal-foreground hover:bg-status-normal/80",
  LIMITED_SHIPMENT: "bg-status-limited text-status-limited-foreground hover:bg-status-limited/80",
  SHIPMENT_SUSPENDED: "bg-status-stop text-status-stop-foreground hover:bg-status-stop/80",
  DISCONTINUED_SALE: "bg-status-discontinued text-status-discontinued-foreground hover:bg-status-discontinued/80",
}

// 包装詳細ページへのリンクをタグ表示
export const PackageStatusTag = ({
  href, 
  label, 
  status, 
  className 
}: PackageStatusTagProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-1 text-xs font-semibold transition-colors",
        STATUS_COLOR_CLASS[status],
        className
      )}
    >
      <Package className="h-3 w-3" />
      {label}
    </Link>
  )
}
