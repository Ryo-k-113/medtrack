import { useOffsetPaginatedFetch } from "@/hooks/useOffsetPaginatedFetch"
import type { GetGenericNamesResponse } from "@/types/admin/genericName"

/**
 *  成分名一覧をページネーション付きで取得するカスタムフック
 *  @returns 成分名一覧、ページ情報、ローディング状態、エラー、データ再取得関数、ページ操作関数
 */

export const useAdminGenericNames = () => {
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
  } = useOffsetPaginatedFetch<GetGenericNamesResponse>("/api/admin/generic-names")

  return {
    genericNames: data?.genericNames ?? [],
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
