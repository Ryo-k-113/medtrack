import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { badgeVariants } from "@/components/ui/badge"
import { PackageStatusTagList } from "./PackageStatusTagList"
import { ProductTypeTag } from "@/components/Badge/ProductTypeTag"
import { CompanyTag } from "@/components/Badge/CompanyTag"
import { BookmarkButton } from "@/components/Button/BookmarkButton"
import type { SearchDrugResult } from "@/types/search"
import { buildPackageInsertUrl } from "@/utils/packageInsert"
import { cn } from "@/lib/utils"


type DrugCardProps = {
  drug: SearchDrugResult
  notifyBookmarkChange?: boolean
}

export const DrugCard = ({ drug, notifyBookmarkChange = false }: DrugCardProps) => {
  // 添付文書はPMDAの該当ページを開く（YJコードから作る）
  const packageInsertUrl = buildPackageInsertUrl(drug.yjCode)

  return (
    <Card className="shadow">
      <CardContent className="px-4 py-4 space-y-4 md:px-6">

        {/* 上段：区分タグ、販売会社タグ、添付文書リンク */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {/* 区分はモバイルで1文字表示 */}
            <ProductTypeTag type={drug.productType} compact className="shrink-0 whitespace-nowrap" />
            {/* 販売会社 */}
            <CompanyTag name={drug.SalesCompany.name} compact />
          </div>

          {/* 添付文書（PMDA）へのリンク */}
          {packageInsertUrl && (
            <Link
              href={packageInsertUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="添付文書（PMDAのページが新しいタブで開きます）"
              className={cn(
                badgeVariants({ variant: "outline", size: "compact" }),
                "shrink-0 gap-1 rounded-md border-primary/30 bg-background text-primary hover:border-primary hover:bg-primary/5"
              )}
            >
              添付文書
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </Link>
          )}
        </div>

        {/* 中段：ブックマーク・医薬品名・薬価 */}
        <div className="flex flex-col items-start justify-between md:flex-row md:gap-4">
          <div className="flex items-start gap-2">
            <BookmarkButton
              drugId={drug.id}
              drugName={notifyBookmarkChange ? drug.name : undefined}
              className="mt-1"
            />
            <div>
              <h2 className="text-lg font-bold">{drug.name}</h2>
              {/* 成分名 */}
              <p className="text-sm text-weak">{drug.GenericName.name}</p>
            </div>
          </div>
          <p className="hidden md:block shrink-0 text-sm text-weak text-end pt-1">
            薬価 : {drug.price !== null && drug.price ? `${drug.price}円 / ${drug.Unit.name}` : "-"}
          </p>
        </div>


        {/* 下段：包装単位ごとの出荷状況タグ */}
        <PackageStatusTagList drugId={drug.id} packageUnits={drug.PackageUnits} />
      </CardContent>
    </Card>
  )
}
