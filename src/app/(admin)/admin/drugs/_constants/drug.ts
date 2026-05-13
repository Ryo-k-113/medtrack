
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


//製薬会社
//後々DBからfetchで取得する予定
export const companyOptions = [
  { label: "第一三共", value: "1"},
  { label: "武田薬品", value: "2" },
  { label: "沢井製薬", value: "3" },
  { label: "アステラス製薬", value: "4" },
  { label: "大塚薬品", value: "5" },
  { label: "杏林製薬", value: "6" },
  { label: "第一三共エスファ", value: "7" },
  { label: "日東メディック", value: "8" },
  { label: "ファイザー", value: "9" },
] as const

//規格単位
//後々DBからfetchで取得する予定
export const unitOptions = [
  { label: "錠", value: "1"},
  { label: "mL", value: "2" },
  { label: "g", value: "3" },
  { label: "本", value: "4" },
] as const

//成分名
//後々DBからfetchで取得する予定
export const genericNameOptions = [
  { label: "ロキソプロフェンナトリウム水和物", value: "1"},
  { label: "アスピリン", value: "2"},
] as const