"use client"
import { InfoCard } from "@/components/Card/InfoCard";
import { useAdminPackageUnit } from "../_hooks/useAdminPackageUnit";
import { PublishStatusBadge } from "@/app/(admin)/admin/drugs/_components/PublishStatusBadge";
import { ShippingStatusBadge } from "@/app/(admin)/admin/drugs/_components/ShippingStatusBadge";
import { formatDate } from "@/utils/format";


export const PackageUnitInfo = () => {
  const { packageUnit, isLoading } = useAdminPackageUnit()

  if(isLoading) return <div>読み込み中...</div>
  if (!packageUnit) return <div>包装情報が見つかりません</div>;

  const packageInfoItems = [
    { label: "公開ステータス", value: <PublishStatusBadge status={packageUnit.publishStatus} className="rounded-md"/>},
    { label: "包装名", value: packageUnit.name },
    { label: "出荷ステータス", value: <ShippingStatusBadge status={packageUnit.currentShippingStatus} className="rounded-md" />},

    // 区切り線
    { label: "divider-under-status", value: null, isDivider: true },

    { label: "販売GS1コード", value: packageUnit.gs1SalesCode },
    { label: "調剤GS1コード", value: packageUnit.gs1DispensingCode },
    { label: "統一商品コード", value: packageUnit.unifiedCode },
    { label: "HOTコード", value: packageUnit.hotCode },
    { label: "JANコード", value: packageUnit.janCode },

    // 区切り線
    { label: "divider-under-code", value: null, isDivider: true },

    { label: "経過措置期限", value: formatDate(packageUnit.transitionalMeasuresDate) },
    { label: "販売中止日", value: formatDate(packageUnit.discontinuedDate) },
    { label: "販売移管日", value: formatDate(packageUnit.salesTransferDate) },
  ];


  return (
    <InfoCard title="包装情報" items={packageInfoItems} />
  )
}
