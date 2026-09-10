"use client"

import useSWR from "swr"
import type { CurrentUser } from "@/types/auth"

/** ログイン中のユーザー情報の取得先 */
export const ME_API_PATH = "/api/me"



/**
 * ログイン中のユーザー情報を取得する
 * 未ログインは異常ではないため、nullとして扱う
 */
const fetchMe = async (url: string): Promise<CurrentUser | null> => {
  const res = await fetch(url)

  if (res.status === 401) return null

  if (!res.ok) throw new Error("ユーザー情報の取得に失敗しました")

  return res.json()
}

/**
 * ログイン中のユーザー情報を取得するカスタムフック
 * @returns ユーザー情報、ログイン状態、ローディング状態、エラー、再取得関数
 */
export const useMe = () => {
  const { data, isLoading, error, mutate } = useSWR<CurrentUser | null>(ME_API_PATH, fetchMe)

  return {
    me: data ?? null,
    isLoggedIn: !!data,
    isLoading,
    error,
    mutate,
  }
}
