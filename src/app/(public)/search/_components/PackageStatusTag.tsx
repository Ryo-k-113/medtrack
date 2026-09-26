import Link from "next/link"
import type { CurrentShippingStatus } from "@prisma/client"
import { cn } from "@/lib/utils"
import { STATUS_CHIP_CLASS, STATUS_ICON } from "@/constants/statusChip"

type PackageStatusTagProps = {
  href: string
  label: string
  status: CurrentShippingStatus
  className?: string
}

// 包装詳細ページへのリンクをタグ表示
// 検索結果を残したまま包装を見比べられるよう、新しいタブで開く
export const PackageStatusTag = ({
  href, 
  label, 
  status, 
  className 
}: PackageStatusTagProps) => {
  // 出荷状況を色だけでなくアイコンの形でも示す
  const Icon = STATUS_ICON[status]

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        
        // 注記の付いた長い包装名は折り返す
        "inline-flex max-w-full items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold transition hover:brightness-95",
        STATUS_CHIP_CLASS[status],
        className
      )}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {label}
      <span className="sr-only">（新しいタブで開きます）</span>
    </Link>
  )
}
