import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { CurrentShippingStatus } from "@prisma/client"
import { ShippingStatusBadge } from "@/components/Badge/ShippingStatusBadge"
import { cn } from "@/lib/utils"

type PackageStatusCardProps = {
  name:       string
  status:     CurrentShippingStatus
  href?:       string
  active?:    boolean
  className?: string
}

// 出荷状況バッジと包装名を表示するカード(hrefがある場合はカードリンク)
export const PackageStatusCard = ({
  name,
  status,
  href,
  active    = false,
  className,
}: PackageStatusCardProps) => {

  const baseClassName = cn(
    "relative flex flex-col items-start justify-center gap-2 rounded-lg border p-4",
    active
      ? "border-primary/40 bg-primary/10" 
      : "bg-surface",
    className,
  )

  const content = (
    <>
      <ShippingStatusBadge status={status} className="rounded-md" />
      <p className={cn(
        "font-bold",
        active && "text-primary", 
        "group-hover:text-primary",
      )}>
        {name}
      </p>
    </>
  )


  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          baseClassName,
          "group pr-9 transition-colors",
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