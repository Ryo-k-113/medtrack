import { useDataFetch } from "@/hooks/useDataFetch"
import type { GetUnitsResponse } from "@/types/admin/unit"

/**
 * 規格単位一覧を取得するカスタムフック
 * @returns 規格単位一覧、ローディング状態、データ再取得関数、エラー
 */
export const useAdminUnits = () => {
  const { data, isLoading, mutate, error } = useDataFetch<GetUnitsResponse>(
    "/api/admin/units"
  )

  return { 
    units: data?.units ?? [], 
    isLoading, 
    mutate, 
    error 
  }
}