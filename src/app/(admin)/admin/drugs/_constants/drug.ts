import { ProductType, CurrentShippingStatus, AnnounceType } from "@prisma/client"

//出荷ステータス
export const SHIPPING_STATUS_OPTIONS = [
  { label: "通常出荷", value: CurrentShippingStatus.NORMAL_SHIPMENT },
  { label: "限定出荷", value: CurrentShippingStatus.LIMITED_SHIPMENT },
  { label: "供給停止", value: CurrentShippingStatus.SHIPMENT_SUSPENDED },
  { label: "販売中止", value: CurrentShippingStatus.DISCONTINUED_SALE },
] as const satisfies readonly { label: string; value: CurrentShippingStatus }[]

//製品区分
export const PRODUCT_TYPE_OPTIONS = [
  { label: "先発品", value: ProductType.BRAND_NAME },
  { label: "準先発品", value: ProductType.QUASI_BRAND_NAME },
  { label: "後発品", value: ProductType.GENERIC},
  { label: "その他", value: ProductType.OTHER },
] as const satisfies readonly { label: string; value: ProductType }[]

// 告示情報種別
export const ANNOUNCE_TYPE_OPTIONS = [
  { label: "通常出荷", value: AnnounceType.NORMAL_SHIPMENT },
  { label: "限定出荷", value: AnnounceType.LIMITED_SHIPMENT },
  { label: "供給停止", value: AnnounceType.SHIPMENT_SUSPENDED },
  { label: "販売中止", value: AnnounceType.DISCONTINUED_SALE },
  { label: "販売移管", value: AnnounceType.TRANSFER_OF_SALE },
] as const satisfies readonly { label: string; value: AnnounceType }[]
