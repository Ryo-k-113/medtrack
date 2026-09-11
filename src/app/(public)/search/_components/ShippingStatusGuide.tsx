import { Package } from "lucide-react"
import type { CurrentShippingStatus } from "@prisma/client"
import { cn } from "@/lib/utils"
import { STATUS_CHIP_CLASS } from "@/constants/statusChip"

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

type ShippingStatusGuideProps = {
  className?: string
}

export const ShippingStatusGuide = ({ 
  className 
}: ShippingStatusGuideProps) => {
  return (
    // モバイルは折り返さず横スクロール（スクロールバーの分の余白も確保する）、md以上は折り返す
    <div
      className={cn(
        "flex items-center gap-2 overflow-x-auto pb-3 text-xs text-weak md:flex-wrap md:overflow-x-visible md:pb-0",
        className
      )}
    >
      <span className="shrink-0">出荷状況:</span>
      <div className="flex items-center gap-1.5 md:flex-wrap">
        {STATUS_GUIDE_ITEMS.map((item) => (
          <span
            key={item.status}
            className={cn(
              // 横スクロール時に縮まないようshrink-0を持たせる
              "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 py-1 font-semibold select-none",
              STATUS_CHIP_CLASS[item.status]
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