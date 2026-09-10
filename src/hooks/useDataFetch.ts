"use client"
import useSWR from 'swr'
import { fetcher } from '@/utils/fetcher';

/**
 * APIエンドポイントからGETメソッドでデータを取得する汎用カスタムフック
 * 認証はCookieのセッションで行われるため、トークンの取得・付与は不要
 * @param url - 取得対象のAPIエンドポイントパス（nullの場合はリクエストしない）
 * @returns レスポンスデータ、ローディング状態、エラー情報、キャッシュ再取得（mutate）関数
 */

export const useDataFetch = <T>(url: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<T>(
    url,
    (url: string) => fetcher({ url }),
    { keepPreviousData: true } // ページネーション時に前ページのデータを表示したまま更新
  )

  return { data, isLoading, error, mutate };
};
