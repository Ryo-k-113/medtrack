import { useOffsetPaginatedFetch } from "@/hooks/useOffsetPaginatedFetch"
import type { GetUnitsResponse } from "@/types/admin/unit"

/**
 * 規格単位一覧をページネーション付きで取得するカスタムフック
 * @returns 規格単位一覧、ページ情報、ローディング状態、エラー、データ再取得関数、ページ操作関数
 */
export const useAdminUnits = () => {
  const {
    data,
    page,
    pageSize,
    totalPages,
    search,
    isLoading,
    error,
    mutate,
    changePage,
    changePageSize,
    changeSearch,
  } = useOffsetPaginatedFetch<GetUnitsResponse>("/api/admin/units")

  return {
    units: data?.units ?? [],
    page,
    pageSize,
    totalPages,
    search,
    isLoading,
    error,
    mutate,
    changePage,
    changePageSize,
    changeSearch,
  }
}
