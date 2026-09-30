import { useOptionSearch, type OptionSearch } from "@/hooks/useOptionSearch"
import { toSelectOptions } from "@/utils/selectOption"
import type { GetCompaniesResponse } from "@/types/admin/company"

/**
 * 医薬品フォームの製薬会社（販売会社・製造会社）の候補を、入力した文字で検索して取得するカスタムフック
 * 販売会社と製造会社は検索キーワードが別なので、選択欄ごとに呼び出す
 * @returns 候補、総件数、検索中かどうか、エラー、検索キーワードの変更関数
 */
export const useCompanyOptions = (): OptionSearch =>
  useOptionSearch<GetCompaniesResponse>("/api/admin/companies", (data) =>
    toSelectOptions(data.companies)
  )
