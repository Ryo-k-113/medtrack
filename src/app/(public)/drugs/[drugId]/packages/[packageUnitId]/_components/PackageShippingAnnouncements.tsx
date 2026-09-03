"use client"

import { BaseTable } from "@/components/Table/BaseTable"
import { PackageShippingAnnouncementColumns } from "./PackageShippingAnnouncementColumns"
import { SectionCard } from "@/components/Card/SectionCard"
import { PackageShippingAnnouncementsSkeleton } from "./PackageShippingAnnouncementsSkeleton"
import { usePackageDetail } from "@/hooks/usePackageDetail"

// 包装の告知履歴（出荷状況の告知の変遷）
export const PackageShippingAnnouncements = () => {
  const { shippingAnnouncements, isLoading } = usePackageDetail()

  if (isLoading || !shippingAnnouncements) return <PackageShippingAnnouncementsSkeleton />

  return (
    <SectionCard title="告知履歴">
      <BaseTable
        columns={PackageShippingAnnouncementColumns}
        data={shippingAnnouncements}
        emptyContent="告知履歴はありません"
        headerClassName="bg-slate-200/40 font-bold text-foreground hover:bg-slate-200/40"
      />
    </SectionCard>
  )
}
