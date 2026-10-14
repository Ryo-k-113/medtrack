import type { Drug, PackageUnit } from "@/types/drug"
import type { DosageForm, GenericName, PharmaceuticalCompany, ProductType, Unit } from "@prisma/client"


/** 検索結果の医薬品カードの型 */
export type SearchDrugResult = Pick<
  Drug,
  "id" | "name" | "yjCode" | "productType" | "price"
> & {
  Unit: Pick<Unit, "id" | "name">
  GenericName: Pick<GenericName, "id" | "name">
  SalesCompany: Pick<PharmaceuticalCompany, "id" | "name">
  PackageUnits: Pick<
    PackageUnit,
    "id" | "name" | "breakdown" | "variant" | "currentShippingStatus"
  >[]
}

/** 検索結果の絞り込み条件（空の配列は絞り込まない） */
export type SearchFilters = {
  productTypes: ProductType[]
  dosageForms: DosageForm[]
}

/** 医薬品検索のレスポンス型 */
export type SearchDrugsResponse = {
  drugs: SearchDrugResult[]
  totalCount: number
}
