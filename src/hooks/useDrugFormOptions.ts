import { useDataFetch } from "@/hooks/useDataFetch"
import type { GetCompaniesResponse } from "@/types/admin/company"
import type { GetGenericNamesResponse } from "@/types/admin/genericName"
import type { GetUnitsResponse } from "@/types/admin/unit"
import { SelectOption } from "@/types/ui/select"

/**
 * 医薬品フォームに必要な各種マスタデータ（製薬会社、規格単位、一般名）をマスタAPIを並列取得し、`SelectOption`（label, value）形式に変換
 * @returns {FormOptions} 各マスタの選択肢データ、全体でのローディング状態、および最初に発生したエラー
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
  error: Error | undefined
}

export const useDrugFormOptions = (): FormOptions => {
  const { data: companyData, isLoading: isCompaniesLoading, error: companiesError } =
    useDataFetch<GetCompaniesResponse>("/api/admin/companies")

  const { data: unitData, isLoading: isUnitsLoading, error: unitsError } =
    useDataFetch<GetUnitsResponse>("/api/admin/units")

  const { data: genericNameData, isLoading: isGenericNamesLoading, error: genericNamesError } =
    useDataFetch<GetGenericNamesResponse>("/api/admin/generic-names")

  // フォームitemに合う形に変換
  const companyOptions = toSelectOptions(companyData?.companies ?? [])
  const unitOptions = toSelectOptions(unitData?.units ?? [])
  const genericNameOptions = toSelectOptions(genericNameData?.genericNames ?? [])

  return {
    companyOptions,
    unitOptions,
    genericNameOptions,
    isLoading: isCompaniesLoading || isUnitsLoading || isGenericNamesLoading,
    error: companiesError ?? unitsError ?? genericNamesError,
  }
}