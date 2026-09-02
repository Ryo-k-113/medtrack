import type { ProductType } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ProductTypeTagProps = {
  type: ProductType
  className?: string
}

// 製品区分のラベルと色分け（OTHERは非表示のため未定義）
const PRODUCT_TYPE_MAP: Partial<Record<ProductType, { label: string; className: string }>> = {
  BRAND_NAME: {
    label: "先発品",
    className: "bg-tag-brand text-tag-brand-foreground hover:bg-tag-brand",
  },
  QUASI_BRAND_NAME: {
    label: "準先発品",
    className: "bg-tag-quasiBrand text-tag-quasiBrand-foreground hover:bg-tag-quasiBrand",
  },
  GENERIC: {
    label: "後発品",
    className: "bg-tag-generic text-tag-generic-foreground hover:bg-tag-generic",
  },
}

export const ProductTypeTag = ({ type, className }: ProductTypeTagProps) => {
  const productType = PRODUCT_TYPE_MAP[type]

  if (!productType) return null

  return (
    <Badge className={cn("rounded-md px-2 py-1", productType.className, className)}>
      {productType.label}
    </Badge>
  )
}
