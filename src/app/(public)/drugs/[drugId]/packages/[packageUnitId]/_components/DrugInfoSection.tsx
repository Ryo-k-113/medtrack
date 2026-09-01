"use client"

import { SectionCard } from "@/components/Card/SectionCard"
import { DrugInfoSectionSkeleton } from "./DrugInfoSectionSkeleton"
import { usePackageDetail } from "@/hooks/usePackageDetail"

// ラベルと値を表示する情報ボックス
const InfoBox = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border bg-surface px-4 py-3">
    <p className="text-xs text-weak">{label}</p>
    <p className="truncate text-sm font-bold">{value}</p>
  </div>
)

// 製品情報を表示するカード
export const DrugInfoSection = () => {
  const { drug, isLoading } = usePackageDetail()

  if (isLoading || !drug) return <DrugInfoSectionSkeleton />

  return (
    <SectionCard title="薬品情報">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoBox
          label="薬価"
          value={drug.price !== null ? `${drug.price}円 / ${drug.Unit.name}` : "-"}
        />
        <InfoBox label="YJコード" value={drug.yjCode} />
        <InfoBox label="販売会社" value={drug.SalesCompany.name} />
        <InfoBox label="製造会社" value={drug.ManufacturingCompany.name} />
      </div>
    </SectionCard>
  )
}
