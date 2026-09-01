"use client"

import { SectionCard } from "@/components/Card/SectionCard"
import { PackageStatusCard } from "./PackageStatusCard"
import { SelectedPackageSectionSkeleton } from "./SelectedPackageSectionSkeleton"
import { CopyButton } from "@/components/Button/CopyButton"
import { usePackageDetail } from "@/hooks/usePackageDetail"
import { cn } from "@/lib/utils"


// コードを表示するボックス（値があればコピーボタンを表示）
const CodeBox = ({ label, value }: { label: string; value: string | null }) => (
  <div className="flex items-start justify-between gap-3 rounded-lg border bg-surface px-4 py-3">
    <div className="min-w-0">
      <p className="text-sm text-weak">{label}</p>
      <p className={cn("break-all font-bold", !value && "text-sm font-normal text-weak")}>
        {value ?? "未登録"}
      </p>
    </div>
    {value && <CopyButton value={value} label={label} />}
  </div>
)

// 包装情報カード
export const SelectedPackageSection = () => {
  const { packageUnit, isLoading } = usePackageDetail()

  if (isLoading || !packageUnit) return <SelectedPackageSectionSkeleton />

  return (
    <SectionCard title="包装情報" className="space-y-3">

      {/* 現在の包装 */}
      <PackageStatusCard
        name={packageUnit.name}
        status={packageUnit.currentShippingStatus}
        active
      />

      {/* コード表示 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CodeBox label="販売GS1コード" value={packageUnit.gs1SalesCode} />
        <CodeBox label="調剤GS1コード" value={packageUnit.gs1DispensingCode} />
        <CodeBox label="統一商品コード" value={packageUnit.unifiedCode} />
        <CodeBox label="HOTコード" value={packageUnit.hotCode} />
        <CodeBox label="JANコード" value={packageUnit.janCode} />
      </div>
    </SectionCard>
  )
}
