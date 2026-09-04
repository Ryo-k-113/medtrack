"use client"

import { mutate as globalMutate } from "swr"
import { useDataFetch } from "@/hooks/useDataFetch"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { fetcher } from "@/utils/fetcher"
import type { BookmarkIdsResponse } from "@/types/bookmark"


/**
 * ブックマーク関連のキャッシュをまとめて再取得する
 * ID一覧とマイページの医薬品一覧を対象にする
 * （useDataFetchのキーは [url, token] のため、url部分で判定する）
 */
const revalidateBookmarks = () =>
  globalMutate(
    (key) =>
      Array.isArray(key) &&
      typeof key[0] === "string" &&
      key[0].startsWith("/api/bookmarks")
  )


/**
 * ブックマークの状態判定と追加・解除を行うカスタムフック
 * 医薬品カードごとに呼ばれるため、医薬品データは持たずIDのみを取得する
 * @returns ブックマーク医薬品ID一覧、bookmark状態判定、追加・解除、ログイン状態
 */
export const useBookmarks = () => {
  const { session, token } = useSupabaseSession()

  // 未ログイン時はリクエストしない
  const { data, isLoading } = useDataFetch<BookmarkIdsResponse>(
    session ? "/api/bookmarks/ids" : null
  )

  const drugIds = data?.drugIds ?? []

  // ブックマーク済みかどうか
  const isBookmarked = (drugId: number) => drugIds.includes(drugId)


  // ID一覧のキャッシュを即座に書き換えてUIに反映する
  const rewriteCacheIds = (updateIds: (currentIds: number[]) => number[]) =>
    globalMutate(
      ["/api/bookmarks/ids", token],
      (current?: BookmarkIdsResponse) =>
        current ? { drugIds: updateIds(current.drugIds) } : current,
      { revalidate: false } // 再取得はrevalidateBookmarksで行う
    )

  // ブックマークに追加
  const addBookmark = async (drugId: number) => {

    await rewriteCacheIds((currentIds) => [...currentIds, drugId])

    try {
      await fetcher({
        url: "/api/bookmarks",
        method: "POST",
        body: { drugId },
        token
      })
    } finally {
      //サーバーの実データと同期する
      await revalidateBookmarks()
    }
  }

  //　ブックマークを解除
  const removeBookmark = async (drugId: number) => {

    await rewriteCacheIds((currentIds) =>
      currentIds.filter((id) => id !== drugId)
    )

    try {
      await fetcher({
        url: `/api/bookmarks/${drugId}`,
        method: "DELETE",
        token
      })
    } finally {
      // サーバーの実データと同期する
      await revalidateBookmarks()
    }
  }

  /**
   * ブックマークの追加・解除の切り替え
   * @param drugId - 対象の医薬品ID
   */
  const toggleBookmark = async (drugId: number) => {
    if (isBookmarked(drugId)) {
      await removeBookmark(drugId)
    } else {
      await addBookmark(drugId)
    }
  }

  return {
    drugIds,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isLoggedIn: !!session,
    isLoading,
  }
}


