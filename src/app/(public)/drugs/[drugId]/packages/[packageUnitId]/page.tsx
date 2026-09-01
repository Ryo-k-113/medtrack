"use client"

import { notFound } from "next/navigation"
import { usePackageDetail } from "@/hooks/usePackageDetail"
import { DrugSummary } from "./_components/DrugSummary"
import { SelectedPackageSection } from "./_components/SelectedPackageSection"
import { DrugInfoSection } from "./_components/DrugInfoSection"
import { OtherPackageList } from "./_components/OtherPackageList"
import { PackageAnnounceHistory } from "./_components/PackageAnnounceHistory"

export default function PackageDetailPage() {
  const { packageUnit, isLoading, error } = usePackageDetail()

  if (error) throw error

  if (!isLoading && !packageUnit) notFound()

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-6 md:py-10">

      {/* 医薬品の基本情報 */}
      <DrugSummary />

      {/* 選択中の包装とコード情報 */}
      <SelectedPackageSection />

      {/* 他の包装形態 */}
      <OtherPackageList />
      
      {/* 製品情報 */}
      <DrugInfoSection />

      {/* 包装の告知履歴 */}
      <PackageAnnounceHistory />
    </div>
  )
}
