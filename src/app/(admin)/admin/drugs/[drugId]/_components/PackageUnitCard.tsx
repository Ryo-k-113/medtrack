import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ShippingStatusBadge } from "@/components/Badge/ShippingStatusBadge"
import { PublishStatusBadge } from "@/app/(admin)/admin/drugs/_components/PublishStatusBadge"
import type { DrugEditPackageUnitCard  } from "@/types/admin/drug"

type PackageUnitCardProps = {
  pkg: DrugEditPackageUnitCard 
  drugId: string
}

export const PackageUnitCard = ({ pkg, drugId }: PackageUnitCardProps) => {
  return (
    <Link href={`/admin/drugs/${drugId}/packages/${pkg.id}`}>
      <div className="flex items-center justify-between border rounded-md mb-3 hover:bg-surface cursor-pointer group overflow-hidden">
        <div className="flex items-center gap-2 flex-1 p-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">

              {/* カードタイトル */}
              <p>{pkg.name}</p>
              <ShippingStatusBadge
                status={pkg.currentShippingStatus}
                className="rounded-lg"
              />
            </div>
            
            {/* カード内容 */}
            <p className="text-sm">
              GS1販売コード: {pkg.gs1SalesCode} / 統一商品コード: {pkg.unifiedCode}
            </p>
          </div>
          <PublishStatusBadge status={pkg.publishStatus} />
        </div>
        <div className="p-3">
          <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:scale-125 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}