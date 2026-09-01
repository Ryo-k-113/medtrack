"use client"

import { BaseTable } from "@/components/Table/BaseTable"
import { PackageAnnounceHistoryColumns } from "./PackageAnnounceHistoryColumns"
import { SectionCard } from "@/components/Card/SectionCard"
import { PackageAnnounceHistorySkeleton } from "./PackageAnnounceHistorySkeleton"
import { usePackageDetail } from "@/hooks/usePackageDetail"

// 包装の告知履歴（出荷状況の告知の変遷）
export const PackageAnnounceHistory = () => {
  const { announceHistories, isLoading } = usePackageDetail()

  if (isLoading || !announceHistories) return <PackageAnnounceHistorySkeleton />

  return (
    <SectionCard title="告知履歴">
      <BaseTable
        columns={PackageAnnounceHistoryColumns}
        data={announceHistories}
        emptyContent="告知履歴はありません"
        headerClassName="bg-slate-200/40 font-bold text-foreground hover:bg-slate-200/40"
      />
    </SectionCard>
  )
}
