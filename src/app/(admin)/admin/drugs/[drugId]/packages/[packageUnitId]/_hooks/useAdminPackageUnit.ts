import { useParams } from "next/navigation"
import { useDataFetch } from "@/hooks/useDataFetch"
import type { PackageUnitDetailResponse } from "@/types/admin/drug"


/**
 *  包装情報と製品情報、告示情報履歴を取得するカスタムフック
 *  @returns 製品ID、包装ID、製品情報、包装情報、履歴一覧、ローディング状態、データ再取得関数
 */

export const useAdminPackageUnit = () => {
  const params = useParams()
  const drugId = params.drugId as string
  const packageUnitId = params.packageUnitId as string

  const {
    data,
    isLoading,
    mutate,
  } = useDataFetch<PackageUnitDetailResponse>(
    `/api/admin/drugs/${drugId}/packages/${packageUnitId}`
  )

  const packageUnit = data?.data
  const announceHistories = data?.data?.AnnounceHistories ?? []
  const drug = data?.data?.Drug

  return {
    drugId,
    packageUnitId,
    packageUnit,
    announceHistories,
    drug,
    isLoading,
    mutate,
  }
}