"use client"

import { mutate as globalMutate } from "swr"
import { useDataFetch } from "@/hooks/useDataFetch"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { fetcher } from "@/utils/fetcher"
import type {
  BookmarkIdsResponse,
  BookmarkItem,
  CreateBookmarkResponse,
} from "@/types/bookmark"

/** 登録リクエストの応答が返るまでの仮ID */
const UNSYNCED_BOOKMARK_ID = 0

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
 * @returns ブックマーク一覧、bookmark状態判定、追加・解除、ログイン状態
 */
export const useBookmarks = () => {
  const { session, token } = useSupabaseSession()

  // 未ログイン時はリクエストしない
  const { data, isLoading } = useDataFetch<BookmarkIdsResponse>(
    session ? "/api/bookmarks/ids" : null
  )

  const bookmarks = data?.bookmarks ?? []

  // ブックマーク済みかどうか
  const isBookmarked = (drugId: number) =>
    bookmarks.some((bookmark) => bookmark.drugId === drugId)


  // ID一覧のキャッシュを即座に書き換えてUIに反映する
  const rewriteCacheBookmarks = (
    updateBookmarks: (current: BookmarkItem[]) => BookmarkItem[]
  ) =>
    globalMutate(
      ["/api/bookmarks/ids", token],
      (current?: BookmarkIdsResponse) =>
        current ? { bookmarks: updateBookmarks(current.bookmarks) } : current,
      { revalidate: false } // 再取得はrevalidateBookmarksで行う
    )

  // ブックマークに追加
  const addBookmark = async (drugId: number) => {
    // 登録前はサーバーのIDが不明なため、仮のIDで先にUIへ反映する
    await rewriteCacheBookmarks((current) => [
      ...current,
      { id: UNSYNCED_BOOKMARK_ID, drugId },
    ])

    try {
      const result: CreateBookmarkResponse = await fetcher({
        url: `/api/drugs/${drugId}/bookmark`,
        method: "POST",
        body: { drugId },
        token
      })

      // 再取得を待たずに、仮IDを登録結果の実IDへ差し替える
      await rewriteCacheBookmarks((current) =>
        current.map((bookmark) =>
          bookmark.drugId === drugId ? result.bookmark : bookmark
        )
      )
    } finally {
      //サーバーの実データと同期する
      await revalidateBookmarks()
    }
  }

  //　ブックマークを解除
  const removeBookmark = async (drugId: number) => {
    // ブックマークIDの取得
    const bookmarkId = bookmarks.find((bookmark) => bookmark.drugId === drugId)?.id

    // IDが未確定の場合は、実データを取り出す
    if (!bookmarkId) {
      await revalidateBookmarks()
      return
    }

    await rewriteCacheBookmarks((current) =>
      current.filter((bookmark) => bookmark.drugId !== drugId)
    )

    try {
      await fetcher({
        url: `/api/drugs/${drugId}/bookmark`,
        method: "DELETE",
        body: { bookmarkId },
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
    bookmarks,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isLoggedIn: !!session,
    isLoading,
  }
}
