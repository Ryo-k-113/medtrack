import { useDataFetch } from "@/hooks/useDataFetch"
import type { GetDraftPackageUnitsResponse } from "@/types/admin/draft"

/**
 * 下書き状態の包装一覧を取得するカスタムフック
 * @returns 下書き包装一覧、ローディング状態、エラー、更新関数
 */

export const useAdminDraftPackageUnits = () => {
  const { data, isLoading, error, mutate } = useDataFetch<GetDraftPackageUnitsResponse>(
    "/api/admin/drafts/packages"
  )

  return {
    draftPackageUnits: data?.draftPackageUnits ?? [],
    isLoading,
    error,
    mutate,
  }
}