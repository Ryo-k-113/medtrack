import { useDataFetch } from "@/hooks/useDataFetch"
import type { GetCompaniesResponse } from "@/types/admin/company"

/**
 *  製薬会社一覧を取得するカスタムフック
 *  @returns 製薬会社一覧、ローディング状態、データ再取得関数、エラー
 */

export const useAdminCompanies = () => {
  const { data, isLoading, mutate, error } = useDataFetch<GetCompaniesResponse>(
    "/api/admin/companies"
  )

  return { 
    companies: data?.companies ?? [], 
    isLoading, 
    mutate, 
    error 
  }
}