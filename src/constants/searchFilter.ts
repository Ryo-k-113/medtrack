import type { DosageForm, ProductType } from "@prisma/client"

/** 検索結果の絞り込みの選択肢 */
export type FilterOption<T extends string> = {
  value: T
  label: string
  group?: string
}

/** 製品区分の選択肢 */
export const PRODUCT_TYPE_FILTER_OPTIONS: FilterOption<ProductType>[] = [
  { value: "BRAND_NAME", label: "先発品" },
  { value: "QUASI_BRAND_NAME", label: "準先発品" },
  { value: "GENERIC", label: "後発品" },
  { value: "OTHER", label: "その他" },
]

/**
 * 剤形の選択肢（内用薬 → 外用薬 → 注射剤・その他 の順）
 * 項目が多いため見出しでまとめる
 */
export const DOSAGE_FORM_FILTER_OPTIONS: FilterOption<DosageForm>[] = [
  { value: "TABLET", label: "錠剤", group: "内服薬" },
  { value: "OD_TABLET", label: "OD錠", group: "内服薬" },
  { value: "CAPSULE", label: "カプセル", group: "内服薬" },
  { value: "POWDER", label: "散剤・顆粒", group: "内服薬" },
  { value: "LIQUID", label: "液剤・シロップ", group: "内服薬" },
  { value: "SKIN_APPLICATION", label: "塗布剤", group: "外用薬" },
  { value: "EYE_EAR_NOSE", label: "点眼・点耳・点鼻", group: "外用薬" },
  { value: "PATCH", label: "貼付剤", group: "外用薬" },
  { value: "SUPPOSITORY", label: "坐剤", group: "外用薬" },
  { value: "INHALANT", label: "吸入薬", group: "外用薬" },
  { value: "INJECTION", label: "注射剤" },
  { value: "OTHER", label: "その他" },
]
