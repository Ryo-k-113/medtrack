import type { AnnounceType, CurrentShippingStatus, ProductType } from "@prisma/client"


/** 医薬品更新情報タブの種別（現在は告知日のみ。将来的に適用日タブを追加予定） */
export type AnnouncementDateType = "ANNOUNCED"

/** 医薬品更新情報の1件分（包装単位の告示情報） */
export type PackageAnnouncementItem = {
  id: number
  announceType: AnnounceType | null
  announcedDate: string | null
  effectiveDate: string | null
  PackageUnit: {
    id: number
    name: string
    currentShippingStatus: CurrentShippingStatus
    Drug: {
      id: number
      name: string
      productType: ProductType
      GenericName: { id: number; name: string }
      SalesCompany: { id: number; name: string }
    }
  }
}


/** 医薬品の更新情報一覧のレスポンス型 */
export type PackageAnnouncementResponse = {
  items: PackageAnnouncementItem[]
  announcedCount: number
}
