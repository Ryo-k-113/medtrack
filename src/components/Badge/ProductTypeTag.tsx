import type { ProductType } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { ResponsiveLabel } from "@/components/Badge/ResponsiveLabel"
import { cn } from "@/lib/utils"

type ProductTypeTagProps = {
  type: ProductType
  compact?: boolean  //モバイルでは1文字表記(先/準/後)
  className?: string
}

// 製品区分のラベルと色分け（OTHERは非表示のため未定義）
const PRODUCT_TYPE_MAP: Partial<
  Record<ProductType, { label: string; shortLabel: string; className: string }>
> = {
  BRAND_NAME: {
    label: "先発品",
    shortLabel: "先",
    className: "bg-tag-brand text-tag-brand-foreground hover:bg-tag-brand",
  },
  QUASI_BRAND_NAME: {
    label: "準先発品",
    shortLabel: "準",
    className: "bg-tag-quasiBrand text-tag-quasiBrand-foreground hover:bg-tag-quasiBrand",
  },
  GENERIC: {
    label: "後発品",
    shortLabel: "後",
    className: "bg-tag-generic text-tag-generic-foreground hover:bg-tag-generic",
  },
}

export const ProductTypeTag = ({ type, compact = false, className }: ProductTypeTagProps) => {
  const productType = PRODUCT_TYPE_MAP[type]

  if (!productType) return null

  // compact のときだけ、モバイルで1文字にする
  const shortLabel = compact ? productType.shortLabel : productType.label

  return (
    <Badge
      size={compact ? "compact" : "default"}
      className={cn(
        "rounded-md",
        // 1文字のときはモバイルで正方形にする（md以上は通常の幅）
        compact && "w-6 justify-center px-0 md:w-auto md:px-2.5",
        productType.className,
        className
      )}
    >
      <ResponsiveLabel short={shortLabel} full={productType.label} />
    </Badge>
  )
}
