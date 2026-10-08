"use client"

import { Package } from "lucide-react"
import { SectionCard } from "@/components/Card/SectionCard"
import { PackageStatusCard } from "./PackageStatusCard"
import { SelectedPackageSectionSkeleton } from "./SelectedPackageSectionSkeleton"
import { CopyButton } from "@/components/Button/CopyButton"
import { AnnounceScheduleTag } from "@/components/Badge/AnnounceScheduleTag"
import { formatScheduleDate } from "@/utils/format"
import { pickScheduleAnnouncements } from "@/utils/announce"
import { usePackageDetail } from "@/hooks/usePackageDetail"
import { cn } from "@/lib/utils"


// コードを表示するボックス（値があればコピーボタンを表示）
const CodeBox = ({ label, value }: { label: string; value: string | null }) => (
  <div className="flex items-start justify-between gap-3 rounded-lg border bg-surface px-3 py-3 md:px-4">
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
  const { packageUnit, shippingAnnouncements, isLoading } = usePackageDetail()

  if (isLoading || !packageUnit) return <SelectedPackageSectionSkeleton />

  // 予定のタグに出す告知（販売移管・在庫消尽後の販売中止など）
  const schedules = pickScheduleAnnouncements(shippingAnnouncements, packageUnit.currentShippingStatus)

  return (
    <SectionCard title="包装情報" icon={Package} className="space-y-3">

      {/* 現在の包装 */}
      <PackageStatusCard
        name={packageUnit.name}
        breakdown={packageUnit.breakdown}
        variant={packageUnit.variant}
        status={packageUnit.currentShippingStatus}
        scheduleTags={schedules.map((announcement) => (
          <AnnounceScheduleTag
            key={announcement.id}
            announceType={announcement.announceType}
            dateLabel={formatScheduleDate(announcement.effectiveDate, announcement) ?? "-"}
          />
        ))}
      />

      {/* コード表示 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CodeBox label="販売GS1コード" value={packageUnit.gs1SalesCode} />
        <CodeBox label="調剤GS1コード" value={packageUnit.gs1DispensingCode} />
        <CodeBox label="統一商品コード" value={packageUnit.unifiedCode} />
        <CodeBox label="HOTコード" value={packageUnit.hotCode} />
      </div>
    </SectionCard>
  )
}
