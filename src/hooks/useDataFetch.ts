"use client"
import useSWR from 'swr'
import { useSupabaseSession } from './useSupabaseSession';
import { fetcher } from '@/utils/fetcher';

/**
 * APIエンドポイントからGETメソッドでデータを取得する汎用カスタムフック
 * * Supabase Session から認証トークンを自動取得してヘッダーに付与
 * @param  取得対象のAPIエンドポイントパス
 * @returns レスポンスデータ、ローディング状態、エラー情報、キャッシュ再取得（mutate）関数
 */

export const useDataFetch = <T>(url: string) => {
  const { token, isLoading: isSessionLoading } = useSupabaseSession();
  
  const { data, error, isLoading, mutate } = useSWR<T>(
    isSessionLoading ? null : [url, token],
    ([url, token]: [ string, string | null ]) => fetcher({ url, token }),
    { keepPreviousData: true } // ページネーション時に前ページのデータを表示したまま更新
  );

  return { 
    data, 
    isLoading: isLoading || isSessionLoading, 
    error, 
    mutate 
  };
};