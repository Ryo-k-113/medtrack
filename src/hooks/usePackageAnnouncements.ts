"use client"

import { useDataFetch } from "@/hooks/useDataFetch"
import type { PackageAnnouncementResponse } from "@/types/user/drug"

/** 医薬品更新情報の取得先 */
const ANNOUNCES_API_PATH = "/api/announces"

/**
 * 医薬品更新情報（告知日）に基づく包装一覧を取得するカスタムフック
 * @param date - 対象日（yyyy-MM-dd形式）。nullの場合は直近の更新日
 * @returns 一覧、告知情報の件数、表示した日付、ローディング状態、エラー
 */
export const usePackageAnnouncements = (date: string | null) => {
  const url = date
    ? `${ANNOUNCES_API_PATH}?${new URLSearchParams({ date }).toString()}`
    : ANNOUNCES_API_PATH

  const { data, isLoading, error } = useDataFetch<PackageAnnouncementResponse>(url)

  return {
    items: data?.items ?? [],
    announcedCount: data?.announcedCount ?? 0,
    date: data?.date ?? null,
    isLoading,
    error,
  }
}
