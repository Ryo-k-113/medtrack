
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminPackageUnit } from "../_hooks/useAdminPackageUnit";
import { PublishStatusBadge } from "@/app/(admin)/admin/drugs/_components/PublishStatusBadge";
import { ShippingStatusBadge } from "@/app/(admin)/admin/drugs/_components/ShippingStatusBadge";
import { formatDate } from "@/utils/format";


export const PackageUnitInfo = () => {

  const { packageUnit, isLoading } = useAdminPackageUnit()

  if(isLoading) return <div>読み込み中...</div>

  if (!packageUnit) return null;


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
    <Card className="w-full max-w-xl shadow-sm border">

      {/* ヘッダー */}
      <CardHeader className="p-6">
        <div className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-md font-bold">包装情報</CardTitle>
        </div>     
      </CardHeader>

      {/* コンテンツ */}
      <CardContent className="text-sm">
        {packageInfoItems.map((item) => {
          return (
            <div key={item.label} className="w-full">
              {item.isDivider ? (
                // 区切り線の場合
                <div className="my-3 border-b" />
              ) : (
                // データの場合
                <div className="grid grid-cols-3 py-4 items-center border-b">
                  <dt>{item.label}</dt>
                  <dd className={`col-span-2 text-end ${item.value ? "" : "text-slate-400"}`}>
                    {item.value ?? "—"}
                  </dd>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  )
}
