// hooks/useDrugEdit.ts
import { useParams } from "next/navigation"
import { useDataFetch } from "@/hooks/useDataFetch"
import type { DrugEditResponse } from "@/types/admin/drug"

/**
 *  idから製品と関連する包装を取得するカスタムフック
 *  @returns 製品id、製品情報、包装情報、ローディング状態、データ再取得関数
 */


export const useAdminDrug = () => {
  const params = useParams()
  const drugId = params.drugId as string

  const {
    data: drugData,
    isLoading: isDrugLoading,
    mutate,
  } = useDataFetch<DrugEditResponse>(`/api/admin/drugs/${drugId}`)

  const drug = drugData?.data
  const packageUnits = drugData?.data?.PackageUnits ?? []

  return {
    drugId,
    drug,
    packageUnits,
    isDrugLoading,
    mutate,
  }
}