import type { ProductType } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ProductTypeBadgeProps = {
  type: ProductType
  className?: string
}

// OTHERは非表示のため未定義
const PRODUCT_TYPE_MAP: Partial<Record<ProductType, { label: string; className: string }>> = {
  BRAND_NAME: {
    label: "先",
    className: "bg-tag-brand text-tag-brand-foreground hover:bg-tag-brand",
  },
  QUASI_BRAND_NAME: {
    label: "準",
    className: "bg-tag-quasiBrand text-tag-quasiBrand-foreground hover:bg-tag-quasiBrand",
  },
  GENERIC: {
    label: "後",
    className: "bg-tag-generic text-tag-generic-foreground hover:bg-tag-generic",
  },
}

export const ProductTypeBadge = ({ type, className }: ProductTypeBadgeProps) => {
  const productType = PRODUCT_TYPE_MAP[type]

  if (!productType) return null

  return (
    <Badge
      className={cn(
        "h-6 w-6 justify-center rounded-md p-0 text-xs font-bold",
        productType.className,
        className
      )}
    >
      {productType.label}
    </Badge>
  )
}
