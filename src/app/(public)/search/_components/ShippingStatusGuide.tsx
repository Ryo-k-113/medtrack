import { Package } from "lucide-react"
import type { CurrentShippingStatus } from "@prisma/client"
import { cn } from "@/lib/utils"

type StatusGuideItem = {
  label: string
  status: CurrentShippingStatus
}

// 凡例として表示する全ステータスの定義
const STATUS_GUIDE_ITEMS: StatusGuideItem[] = [
  { label: "通常出荷", status: "NORMAL_SHIPMENT" },
  { label: "限定出荷", status: "LIMITED_SHIPMENT" },
  { label: "出荷停止", status: "SHIPMENT_SUSPENDED" },
  { label: "販売中止", status: "DISCONTINUED_SALE" },
]

// PackageStatusTag と揃えたカラー定義
const STATUS_COLOR_CLASS: Record<CurrentShippingStatus, string> = {
  NORMAL_SHIPMENT: "bg-status-normal text-status-normal-foreground",
  LIMITED_SHIPMENT: "bg-status-limited text-status-limited-foreground",
  SHIPMENT_SUSPENDED: "bg-status-stop text-status-stop-foreground",
  DISCONTINUED_SALE: "bg-status-discontinued text-status-discontinued-foreground",
}

type ShippingStatusGuideProps = {
  className?: string
}

export const ShippingStatusGuide = ({ 
  className 
}: ShippingStatusGuideProps) => {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 text-xs text-weak", className)}>
      <span>出荷状況:</span>
      <div className="flex flex-wrap items-center gap-1.5">
        {STATUS_GUIDE_ITEMS.map((item) => (
          <span
            key={item.status}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 font-semibold select-none",
              STATUS_COLOR_CLASS[item.status]
            )}
          >
            <Package className="h-3 w-3" />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}