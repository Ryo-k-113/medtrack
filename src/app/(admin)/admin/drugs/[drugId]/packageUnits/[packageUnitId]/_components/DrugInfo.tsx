"use client"
import { InfoCard } from "@/components/Card/InfoCard"
import { useAdminPackageUnit } from "../_hooks/useAdminPackageUnit"

export const DrugInfo = () => {
  const { drug, isLoading } = useAdminPackageUnit()

  if(isLoading) return <div>読み込み中...</div>
  if (!drug) return <div>製品が見つかりません</div>

  const drugInfoItems = [
    { label: "製品名", value: drug.name },
    { label: "YJコード", value: drug.yjCode },
    { label: "成分名", value: drug.GenericName.name },
    { label: "販売会社", value: drug.SalesCompany.name  },
    { label: "製造会社", value: drug.ManufacturingCompany.name },
  ];

  return (
    <InfoCard title="製品情報" items={drugInfoItems} />
  )
}

