"use client"

import { useParams } from "next/navigation"
import { useDataFetch } from "@/hooks/useDataFetch"
import type { GetPackageDetailResponse } from "@/types/package"

/**
 * 包装詳細ページ用に、包装情報・製品情報・告知履歴を取得するカスタムフック
 * @returns 製品ID、包装ID、包装情報、製品情報、他の包装形態、告知履歴、ローディング状態、エラー
 */
export const usePackageDetail = () => {
  const params = useParams()
  const drugId = typeof params?.drugId === "string" ? params.drugId : ""
  const packageUnitId = typeof params?.packageUnitId === "string" ? params.packageUnitId : ""


  const url = drugId && packageUnitId
    ? `/api/drugs/${drugId}/packages/${packageUnitId}`
    : null

  const { data, isLoading, error } = useDataFetch<GetPackageDetailResponse>(url)

  const packageUnit = data?.data

  return {
    drugId,
    packageUnitId,
    packageUnit,
    drug: packageUnit?.Drug,
    packageUnits: packageUnit?.Drug?.PackageUnits ?? [],
    shippingAnnouncements: packageUnit?.shippingAnnouncements ?? [],
    isLoading,
    error,
  }
}
