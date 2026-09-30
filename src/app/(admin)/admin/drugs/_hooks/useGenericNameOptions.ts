import { useOptionSearch, type OptionSearch } from "@/hooks/useOptionSearch"
import { toSelectOptions } from "@/utils/selectOption"
import type { GetGenericNamesResponse } from "@/types/admin/genericName"

/**
 * 医薬品フォームの成分名の候補を、入力した文字で検索して取得するカスタムフック
 * @returns 候補、総件数、検索中かどうか、エラー、検索キーワードの変更関数
 */
export const useGenericNameOptions = (): OptionSearch =>
  useOptionSearch<GetGenericNamesResponse>("/api/admin/generic-names", (data) =>
    toSelectOptions(data.genericNames)
  )
