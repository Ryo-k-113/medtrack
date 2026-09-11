"use client"

import { BaseTable } from "@/components/Table/BaseTable"
import { PackageShippingAnnouncementColumns } from "./PackageShippingAnnouncementColumns"
import { SectionCard } from "@/components/Card/SectionCard"
import { PackageShippingAnnouncementsSkeleton } from "./PackageShippingAnnouncementsSkeleton"
import { usePackageDetail } from "@/hooks/usePackageDetail"

/** 表のヘッダーの見た目（共通） */
const HEADER_CLASS = "bg-slate-100/80 border-b border-slate-200 font-bold text-primary hover:bg-slate-100/80"

// 包装の告知履歴（出荷状況の告知の変遷）
export const PackageShippingAnnouncements = () => {
  const { shippingAnnouncements, isLoading } = usePackageDetail()

  if (isLoading || !shippingAnnouncements) return <PackageShippingAnnouncementsSkeleton />

  return (
    <SectionCard title="告知履歴">
      {/* 画面幅により表示分け */}

      {/* モバイル */}
      <BaseTable
        columns={PackageShippingAnnouncementColumns.mobile}
        data={shippingAnnouncements}
        emptyContent="告知履歴はありません"
        headerClassName={HEADER_CLASS}
        cellClassName="px-2"
        className="md:hidden"
      />

      {/* md以上：日付を詰めたレイアウト */}
      <BaseTable
        columns={PackageShippingAnnouncementColumns.desktop}
        data={shippingAnnouncements}
        emptyContent="告知履歴はありません"
        headerClassName={HEADER_CLASS}
        className="hidden md:block"
      />
    </SectionCard>
  )
}
