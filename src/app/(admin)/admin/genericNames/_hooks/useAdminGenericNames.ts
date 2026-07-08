import { useDataFetch } from "@/hooks/useDataFetch"
import type { GetGenericNamesResponse } from "@/types/admin/genericName"

/**
 *  成分名一覧を取得するカスタムフック
 *  @returns 成分名一覧、ローディング状態、データ再取得関数、エラー
 */

export const useAdminGenericNames = () => {
  const { data, isLoading, mutate, error } = useDataFetch<GetGenericNamesResponse>(
    "/api/admin/companies"
  )

  return { 
    genericNames: data?.genericNames ?? [], 
    isLoading, 
    mutate, 
    error 
  }
}