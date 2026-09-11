import Link from "next/link"
import { Package } from "lucide-react"
import type { CurrentShippingStatus } from "@prisma/client"
import { cn } from "@/lib/utils"
import { STATUS_CHIP_CLASS } from "@/constants/statusChip"

type PackageStatusTagProps = {
  href: string
  label: string
  status: CurrentShippingStatus
  className?: string
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
        // 配色は出荷状況ガイドと共通。リンクと分かるよう、ホバーで少し濃くする
        "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold transition hover:brightness-95",
        STATUS_CHIP_CLASS[status],
        className
      )}
    >
      <Package className="h-3 w-3" />
      {label}
    </Link>
  )
}
