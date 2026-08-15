import { useOffsetPaginatedFetch } from "@/hooks/useOffsetPaginatedFetch"
import type { GetPublishedPackageUnitsResponse } from "@/types/admin/drug"

/**
 * 公開中の医薬品(包装)一覧を取得するカスタムフック
 * @returns 包装一覧・ページ情報・ローディング状態・エラー・ページ操作関数
 */
export const useAdminDrugs = () => {
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
  } = useOffsetPaginatedFetch<GetPublishedPackageUnitsResponse>(
    "/api/admin/drugs"
  )

  return {
    packageUnits: data?.packageUnits ?? [],
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