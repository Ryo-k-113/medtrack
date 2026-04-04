"use client"
import useSWR from 'swr'
import { useSupabaseSession } from './useSupabaseSession';
import { fetcher } from '@/_utils/fetcher';

/**
 * APIエンドポイントからGETメソッドでデータを取得する汎用的なカスタムフック
 */

export const useDataFetch = <T>(url: string) => {
  const { token, isLoading: isSessionLoading } = useSupabaseSession();
  const { data, error, isLoading, mutate } = useSWR<T>(
    isSessionLoading ? null : [url, token],
    ([url, token]: [ string, string | null ]) => fetcher({ url, token })
  );

  return { data, isLoading: isLoading || isSessionLoading, error, mutate };
};