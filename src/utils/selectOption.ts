import type { SelectOption } from "@/types/ui/select"

/** id と name を持つマスタ（成分名・規格単位・製薬会社など） */
type NamedItem = { id: number; name: string }

/**
 * マスタ1件を選択肢（label, value）の形にする
 * @param item - 変換するマスタ（未設定なら null を返す）
 */
export const toSelectOption = (item?: NamedItem | null): SelectOption | null =>
  item ? { label: item.name, value: String(item.id) } : null

/**
 * マスタの一覧を選択肢（label, value）の一覧にする
 * @param items - 変換するマスタの一覧
 */
export const toSelectOptions = (items: NamedItem[]): SelectOption[] =>
  items.map(({ id, name }) => ({ label: name, value: String(id) }))
