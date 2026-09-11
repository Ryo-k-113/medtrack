import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { AnnounceTypeBadge } from "@/components/Badge/AnnounceTypeBadge"
import { ProductTypeTag } from "@/components/Badge/ProductTypeTag"
import { CompanyTag } from "@/components/Badge/CompanyTag"
import { formatDate } from "@/utils/format"
import type { PackageAnnouncementItem } from "@/types/user/drug"


type PackageAnnouncementCardProps = {
  item: PackageAnnouncementItem
}

// 情報更新された包装カード(包装詳細へのリンク)
export const PackageAnnouncementCard = ({ item }: PackageAnnouncementCardProps) => {

  const { PackageUnit:packageUnit, announceType, announcedDate, effectiveDate } = item
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
          <div className="flex items-center gap-4 pt-3 border-t">
            <AnnounceTypeBadge status={announceType} className="rounded-md" />
            <span className="text-sm text-weak">
              告知日: {formatDate(announcedDate)}
            </span>
            <span className="text-sm text-weak">
              適用日: {formatDate(effectiveDate)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
