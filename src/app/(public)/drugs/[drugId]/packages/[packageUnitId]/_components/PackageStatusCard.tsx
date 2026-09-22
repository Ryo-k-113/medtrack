import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { CurrentShippingStatus } from "@prisma/client"
import { ShippingStatusBadge } from "@/components/Badge/ShippingStatusBadge"
import { cn } from "@/lib/utils"

type PackageStatusCardProps = {
  name:       string
  status:     CurrentShippingStatus
  /** 内訳（「10錠×10」） */
  breakdown?: string | null
  /** 注記（「広口開栓型」）。同じ包装名を見分けるための補足 */
  variant?:   string | null
  href?:       string
  className?: string
}

// 出荷状況ごとのカード背景色・border色
const STATUS_CARD_CLASS: Record<CurrentShippingStatus, string> = {
  NORMAL_SHIPMENT: "border-status-normal bg-status-normal/10",
  LIMITED_SHIPMENT: "border-amber-200 bg-status-limited/10",
  SHIPMENT_SUSPENDED: "border-status-stop/60 bg-status-stop/10",
  DISCONTINUED_SALE: "border-status-discontinued/40 bg-status-discontinued/20",
}

// 出荷状況バッジと包装名を表示するカード(hrefがある場合はカードリンク)
export const PackageStatusCard = ({
  name, 
  status,
  breakdown,
  variant,
  href,
  className,
}: PackageStatusCardProps) => {

  const baseClassName = cn(
    "relative flex flex-col items-start justify-center gap-2 rounded-lg border p-4 font-semibold text-md",
    STATUS_CARD_CLASS[status],
    className,
  )

  const content = (
    <>
      <ShippingStatusBadge status={status} className="rounded-md" />
      <div className="group-hover:text-primary">
        <p>{name}</p>

        {/* 注記と内訳（登録があるものだけ表示する） */}
        {variant && <p className="text-xs font-normal text-weak">{variant}</p>}
        {breakdown && <p className="text-xs font-normal text-weak">内訳 {breakdown}</p>}
      </div>
    </>
  )


  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          baseClassName,
          "group pr-9 py-3 transition-colors",
          "hover:border-primary hover:bg-primary/10",
        )}
      >
        {content}
        <ChevronRight className="absolute bottom-3 right-3 h-4 w-4 text-weak transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </Link>
    )
  }


  return (
    <div className={baseClassName}>
      {content}
    </div>
  )
}