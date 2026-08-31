import type { Drug, PackageUnit, ShippingAnnouncement } from "@/types/drug"
import type { GenericName, PharmaceuticalCompany, Unit } from "@prisma/client"


/** 包装詳細ページの型 */
export type PackageDetailResult = Pick<
  PackageUnit,
  | "id" | "name" | "gs1SalesCode" | "gs1DispensingCode" | "hotCode" | "janCode" | "unifiedCode"
  | "currentShippingStatus" | "salesTransferDate" | "discontinuedDate"
> & {
  Drug: Pick<
    Drug,
    "id" | "name" | "yjCode" | "productType" | "isSelectMedical" | "price" | "packageInsertUrl"
  > & {
    Unit: Pick<Unit, "id" | "name">
    GenericName: Pick<GenericName, "id" | "name">
    SalesCompany: Pick<PharmaceuticalCompany, "id" | "name">
    ManufacturingCompany: Pick<PharmaceuticalCompany, "id" | "name">
    PackageUnits: Pick<PackageUnit, "id" | "name" | "currentShippingStatus">[]
  }
  AnnounceHistories: Pick<ShippingAnnouncement, "id" | "announcedDate" | "effectiveDate" | "announceType">[]
}

/** 包装詳細取得のレスポンス型 */
export type GetPackageDetailResponse = {
  data: PackageDetailResult
}
