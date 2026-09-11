"use client"
import useSWR, { type SWRConfiguration } from 'swr'
import { fetcher } from '@/utils/fetcher';

/**
 * APIエンドポイントからGETメソッドでデータを取得する汎用カスタムフック
 * 認証はCookieのセッションで行われるため、トークンの取得・付与は不要
 * @param url - 取得対象のAPIエンドポイントパス（nullの場合はリクエストしない）
 * @param options - 取得の設定（再取得の条件など）。既定の設定に上書きする
 * @returns レスポンスデータ、ローディング状態、エラー情報、キャッシュ再取得（mutate）関数
 */

export const useDataFetch = <T>(url: string | null, options?: SWRConfiguration<T>) => {
  const { data, error, isLoading, mutate } = useSWR<T>(
    url,
    (url: string) => fetcher({ url }),
    {
      keepPreviousData: true, // ページネーション時に前ページのデータを表示したまま更新
      ...options,
    }
  )

  return { data, isLoading, error, mutate };
};
