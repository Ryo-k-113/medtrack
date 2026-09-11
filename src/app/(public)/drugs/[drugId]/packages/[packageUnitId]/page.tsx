"use client"

import { notFound } from "next/navigation"
import { PageContainer } from "@/components/Layout/PageContainer"
import { usePackageDetail } from "@/hooks/usePackageDetail"
import { DrugSummary } from "./_components/DrugSummary"
import { SelectedPackageSection } from "./_components/SelectedPackageSection"
import { DrugInfoSection } from "./_components/DrugInfoSection"
import { OtherPackageList } from "./_components/OtherPackageList"
import { PackageShippingAnnouncements } from "./_components/PackageShippingAnnouncements"

export default function PackageDetailPage() {
  const { packageUnit, isLoading, error } = usePackageDetail()

  if (error) throw error

  if (!isLoading && !packageUnit) notFound()

  return (
    <PageContainer className="space-y-6">

      {/* 医薬品の基本情報 */}
      <DrugSummary />

      {/* 選択中の包装とコード情報 */}
      <SelectedPackageSection />

      {/* 他の包装形態 */}
      <OtherPackageList />
      
      {/* 製品情報 */}
      <DrugInfoSection />

      {/* 包装の告知履歴 */}
      <PackageShippingAnnouncements />
    </PageContainer>
  )
}
