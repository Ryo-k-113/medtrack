import type { Drug as BaseDrug, PackageUnit } from "@/types/drug"


/** 下書きの包装の基本型 */
export type DraftPackageUnit =  PackageUnit & {
  Drug: DraftDrug
}

/** 下書きの包装で使用する医薬品の型 */
type DraftDrug = Pick<BaseDrug, "id" | "name">



/** 下書きの包装一覧取得のレスポンス型 */
export type GetDraftPackageUnitsResponse = {
  draftPackageUnits: DraftPackageUnit[]
}

/** 下書きから公開へ更新のレスポンス型 */
export type PublishPackageUnitResponse = {
  message: string
  data: Pick<DraftPackageUnit, "id" | "name" | "Drug">
}