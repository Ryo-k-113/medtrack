import type { SearchDrugResult } from "@/types/search"

/** ブックマークした医薬品（カード表示に検索結果と同じ形を使う） */
export type BookmarkedDrug = SearchDrugResult

/** ブックマーク一覧のレスポンス型（マイページ用） */
export type BookmarksResponse = {
  drugs: BookmarkedDrug[]
}

/** ブックマーク登録のリクエスト型 */
export type CreateBookmarkRequest = {
  drugId: number
}

/** ブックマーク登録のレスポンス型 */
export type CreateBookmarkResponse = {
  message: string
}

/** ブックマーク解除のレスポンス型 */
export type DeleteBookmarkResponse = {
  message: string
}

