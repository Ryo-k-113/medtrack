import { FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconTooltipLink } from "@/components/Tooltip/IconTooltipLink"
import { PackageStatusTag } from "./PackageStatusTag"
import { ProductTypeTag } from "./ProductTypeTag"
import type { SearchDrugResult } from "@/types/search"


type DrugCardProps = {
  drug: SearchDrugResult
}

export const DrugCard = ({ drug }: DrugCardProps) => {
  return (
    <Card className="shadow">
      <CardContent className="px-6 py-4 space-y-4">

        {/* 上段：区分タグ、販売会社タグ、添付文書リンク */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ProductTypeTag type={drug.productType} />
            <Badge variant="secondary" className="rounded-md">
              {drug.SalesCompany.name}
            </Badge>
          </div>

          {drug.packageInsertUrl && (  
            <IconTooltipLink
              href={drug.packageInsertUrl}
              icon={FileText}
              tooltipText="添付文書を開く"
            />
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
