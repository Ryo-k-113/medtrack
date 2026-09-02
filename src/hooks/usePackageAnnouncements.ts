"use client"

import { useDataFetch } from "@/hooks/useDataFetch"
import type { PackageAnnouncementResponse } from "@/types/user/drug"

/**
 * 医薬品更新情報（告知日）に基づく包装一覧を取得するカスタムフック
 * @param date - 対象日（yyyy-MM-dd形式）
 * @returns 一覧、告知情報の件数、ローディング状態、エラー
 */
export const usePackageAnnouncements = (date: string) => {
  const query = new URLSearchParams({ date })

  const { data, isLoading, error } = useDataFetch<PackageAnnouncementResponse>(
    date ? `/api/announces?${query.toString()}` : null
  )

  return {
    items: data?.items ?? [],
    announcedCount: data?.announcedCount ?? 0,
    isLoading,
    error,
  }
}
