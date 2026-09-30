import { useOptionSearch, type OptionSearch } from "@/hooks/useOptionSearch"
import { toSelectOptions } from "@/utils/selectOption"
import type { GetUnitsResponse } from "@/types/admin/unit"

/**
 * 医薬品フォームの規格単位の候補を、入力した文字で検索して取得するカスタムフック
 * @returns 候補、総件数、検索中かどうか、エラー、検索キーワードの変更関数
 */
export const useUnitOptions = (): OptionSearch =>
  useOptionSearch<GetUnitsResponse>("/api/admin/units", (data) =>
    toSelectOptions(data.units)
  )
