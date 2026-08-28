import type { Drug, PackageUnit } from "@/types/drug"
import type { GenericName, PharmaceuticalCompany, Unit } from "@prisma/client"


/** 検索結果の医薬品カードの型 */
export type SearchDrugResult = Pick<
  Drug,
  "id" | "name" | "yjCode" | "productType" | "price" | "packageInsertUrl"
> & {
  Unit: Pick<Unit, "id" | "name">
  GenericName: Pick<GenericName, "id" | "name">
  SalesCompany: Pick<PharmaceuticalCompany, "id" | "name">
  PackageUnits: Pick<PackageUnit, "id" | "name" | "currentShippingStatus">[]
}

/** 医薬品検索のレスポンス型 */
export type SearchDrugsResponse = {
  drugs: SearchDrugResult[]
  totalCount: number
}
