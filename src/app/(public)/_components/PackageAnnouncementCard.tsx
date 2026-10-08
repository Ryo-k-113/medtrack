import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { AnnounceTypeBadge } from "@/components/Badge/AnnounceTypeBadge"
import { ProductTypeTag } from "@/components/Badge/ProductTypeTag"
import { CompanyTag } from "@/components/Badge/CompanyTag"
import { StockDepletionTag } from "@/components/Badge/StockDepletionTag"
import { formatDate, formatEffectiveDate } from "@/utils/format"
import { cn } from "@/lib/utils"
import type { PackageAnnouncementItem } from "@/types/user/drug"


type PackageAnnouncementCardProps = {
  item: PackageAnnouncementItem
}

// 情報更新された包装カード(包装詳細へのリンク)
export const PackageAnnouncementCard = ({ item }: PackageAnnouncementCardProps) => {

  const { PackageUnit:packageUnit, announceType, announcedDate, effectiveDate, isAfterStockDepletion } = item
  const { Drug: drug } = packageUnit
  const { productType, SalesCompany: salesCompany } = drug

  if(!announceType) return
  return (
    <Link href={`/drugs/${drug.id}/packages/${packageUnit.id}`} className="block">
      <Card className="shadow transition-colors hover:border-primary">
        <CardContent className="space-y-3 px-4 py-4 md:px-6">

          {/* 上段: 製品区分 + 販売会社 */}
          <div className="flex items-center gap-2">
            <ProductTypeTag type={productType} className="px-2 py-1" />
            <CompanyTag name={salesCompany.name} className="py-1" />
          </div>

          {/* 中段: 医薬品名・包装名 */}
          <div>
            <p className="text-lg font-bold text-foreground">{drug.name}</p>
            <p className="text-primary font-semibold mb-3">{packageUnit.name}</p>
          </div>

          {/* 下段: 告知内容・日付 */}
          <div
            className={cn(
              "flex gap-4 border-t pt-3",
              isAfterStockDepletion
                ? "flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4"
                : "items-center"
            )}
          >

            {/* 在庫消尽後の告知は、種別の横にタグを並べる */}
            <div className="flex shrink-0 items-center gap-1">
              <AnnounceTypeBadge status={announceType} className="shrink-0 whitespace-nowrap rounded-md" />
              {isAfterStockDepletion && <StockDepletionTag />}
            </div>

            {/* 通常はモバイルで縦に並べ、在庫消尽後は横並び */}
            <div
              className={cn(
                "flex gap-0.5 text-sm text-weak sm:flex-row sm:gap-4",
                isAfterStockDepletion ? "flex-row flex-wrap gap-x-4" : "flex-col"
              )}
            >
              <span className="whitespace-nowrap">
                告知日: {formatDate(announcedDate)}
              </span>
              <span className="whitespace-nowrap">
                適用日: {formatEffectiveDate(effectiveDate, { announceType, announcedDate, isAfterStockDepletion })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
