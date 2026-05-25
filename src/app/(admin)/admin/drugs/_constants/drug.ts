import { ProductType, CurrentShippingStatus } from "@prisma/client"

//出荷ステータス
export const SHIPPING_STATUS_OPTIONS = [
  { label: "通常出荷", value: CurrentShippingStatus.NORMAL_SHIPMENT },
  { label: "限定出荷", value: CurrentShippingStatus.LIMITED_SHIPMENT },
  { label: "出荷停止", value: CurrentShippingStatus.SHIPMENT_SUSPENDED },
] as const satisfies { label: string; value: CurrentShippingStatus }[]

//製品区分
export const PRODUCT_TYPE_OPTIONS = [
  { label: "先発品", value: ProductType.ORIGINAL_PRODUCT },
  { label: "準先発品", value: ProductType.ASSOCIATE_ORIGINAL_PRODUCT },
  { label: "後発品(加算対象)", value: ProductType.GENERIC_WITH_ADD },
  { label: "後発品(加算対象外)", value: ProductType.GENERIC_WITHOUT_ADD },
  { label: "その他", value: ProductType.OTHER },
] as const satisfies { label: string; value: ProductType }[]
