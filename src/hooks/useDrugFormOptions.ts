import { useDataFetch } from "@/hooks/useDataFetch"
import type { GetCompaniesResponse } from "@/types/admin/company"
import type { GetGenericNamesResponse } from "@/types/admin/genericName"
import type { UnitResponse } from "@/types/admin/drug"
import { SelectOption } from "@/types/ui/select"

/**
 *  製薬会社、規格単位、成分名のデータを取得し、医薬品フォーム用のitemに変換するカスタムフック
 */


const toSelectOptions = (
  data: { id: number; name: string }[]
): SelectOption[] =>
  data.map((item) => ({
    label: item.name,
    value: String(item.id),
  }))

type FormOptions = {
  companyOptions: SelectOption[]
  unitOptions: SelectOption[]
  genericNameOptions: SelectOption[]
  isLoading: boolean
}

export const useDrugFormOptions = (): FormOptions => {
  const { data: companyData, isLoading: isCompaniesLoading } =
    useDataFetch<GetCompaniesResponse>("/api/admin/companies")
  
  const { data: unitData, isLoading: isUnitsLoading } =
    useDataFetch<UnitResponse>("/api/admin/units")
  
  const { data: genericNameData, isLoading: isGenericNamesLoading } =
    useDataFetch<GetGenericNamesResponse>("/api/admin/genericNames")

  // フォームitemに合う形に変換
  const companyOptions = toSelectOptions(companyData?.companies ?? [])
  const unitOptions = toSelectOptions(unitData?.units ?? [])
  const genericNameOptions = toSelectOptions(genericNameData?.genericNames ?? [])

  return {
    companyOptions,
    unitOptions,
    genericNameOptions,
    isLoading: isCompaniesLoading || isUnitsLoading || isGenericNamesLoading,
  }
}