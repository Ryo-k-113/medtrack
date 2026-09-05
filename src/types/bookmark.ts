import type { SearchDrugResult } from "@/types/search"


/** ブックマークした医薬品（カード表示に検索結果と同じ形を使う） */
export type BookmarkedDrug = SearchDrugResult

/** ブックマーク一覧のレスポンス型（マイページ用） */
export type BookmarksResponse = {
  drugs: BookmarkedDrug[]
}


/** ブックマークのIDと医薬品IDの組（ブックマーク解除時に使用） */
export type BookmarkItem = {
  id: number
  drugId: number
}

/** ブックマーク済みID一覧のレスポンス型（ボタンの状態判定用） */
export type BookmarkIdsResponse = {
  bookmarks: BookmarkItem[]
}

/** ブックマーク登録のリクエスト型 */
export type CreateBookmarkRequest = {
  drugId: number
}

/** ブックマーク登録のレスポンス型 */
export type CreateBookmarkResponse = {
  message: string
  bookmark: BookmarkItem  //登録したブックマーク
}


/** ブックマーク解除のリクエスト型 */
export type DeleteBookmarkRequest = {
  bookmarkId: number
}

/** ブックマーク解除のレスポンス型 */
export type DeleteBookmarkResponse = {
  message: string
}

