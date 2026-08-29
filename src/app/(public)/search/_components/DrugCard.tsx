import Link from "next/link"
import { FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PackageStatusTag } from "./PackageStatusTag"
import type { ProductType } from "@prisma/client"
import type { SearchDrugResult } from "@/types/search"
import { cn } from "@/lib/utils"

type DrugCardProps = {
  drug: SearchDrugResult
}

// 製品区分のラベルと色分け
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

export const DrugCard = ({ drug }: DrugCardProps) => {
  const productType = PRODUCT_TYPE_MAP[drug.productType]

  return (
    <Card className="shadow">
      <CardContent className="px-6 py-4 space-y-4">

        {/* 上段：区分タグ、販売会社タグ、添付文書リンク */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {productType && (
              <Badge className={cn("rounded-md", productType.className)}>
                {productType.label}
              </Badge>
            )}
            <Badge variant="secondary" className="rounded-md">
              {drug.SalesCompany.name}
            </Badge>
          </div>

          {drug.packageInsertUrl && (
            <Link
              href={drug.packageInsertUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="添付文書を開く"
              className="text-weak hover:text-primary"
            >
              <FileText className="h-5 w-5" />
            </Link>
          )}
        </div>

        {/* 中段：医薬品名・薬価 */}
        <div className="flex flex-col items-start justify-between md:flex-row md:gap-4">
          <div>
            <h3 className="text-lg font-bold">{drug.name}</h3>
            {/* 成分名 */}
            <p className="text-sm text-weak">{drug.GenericName.name}</p>
          </div>
          <p className="hidden md:block shrink-0 text-sm text-weak text-end pt-1">
            薬価 : {drug.price !== null && drug.price ? `${drug.price}円 / ${drug.Unit.name}` : "-"}
          </p>
        </div>


        {/* 下段：包装単位ごとの出荷状況タグ */}
        <div className="flex flex-wrap gap-2">
          {drug.PackageUnits.map((pkg) => (
            <PackageStatusTag
              key={pkg.id}
              href={`/drugs/${drug.id}/packages/${pkg.id}`}
              label={pkg.name}
              status={pkg.currentShippingStatus}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
