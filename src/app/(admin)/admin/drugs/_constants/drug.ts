
//出荷ステータス
export const SHIPPING_STATUS_OPTIONS = [
  { label: "通常出荷", value: "NORMAL_SHIPMENT" },
  { label: "限定出荷", value: "LIMITED_SHIPMENT" },
  { label: "出荷停止", value: "SHIPMENT_SUSPENDED" },
] as const

//製品区分
export const PRODUCT_TYPE_OPTIONS = [
  { label: "先発品", value: "ORIGINAL_PRODUCT" },
  { label: "準先発品", value: "ASSOCIATE_ORIGINAL_PRODUCT" },
  { label: "後発品(加算対象)", value: "GENERIC_WITH_ADD" },
  { label: "後発品(加算対象外)", value: "GENERIC_WITHOUT_ADD" },
  { label: "その他", value: "OTHER" },
] as const
