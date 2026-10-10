import { ProductType, CurrentShippingStatus, AnnounceType } from "@prisma/client"
import { PublishStatus } from "@prisma/client"
import type { CreateDrugFormInput, CreatePackageUnitFormInput } from "@/types/admin/drug"
import { STATUS_CHIP_CLASS } from "@/constants/statusChip"


//出荷ステータス
export const SHIPPING_STATUS_OPTIONS = [
  { label: "通常出荷", value: CurrentShippingStatus.NORMAL_SHIPMENT },
  { label: "限定出荷", value: CurrentShippingStatus.LIMITED_SHIPMENT },
  { label: "出荷停止", value: CurrentShippingStatus.SHIPMENT_SUSPENDED },
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
  { label: "出荷停止", value: AnnounceType.SHIPMENT_SUSPENDED },
  { label: "販売中止", value: AnnounceType.DISCONTINUED_SALE },
  { label: "販売移管", value: AnnounceType.TRANSFER_OF_SALE },
] as const satisfies readonly { label: string; value: AnnounceType }[]

/**
 * 告知種別のセレクトの配色（選択肢と、選択後の入力欄）
 * 出荷状況のチップと同じ色にし、ホバー・キーボード操作中は少し濃くする
 */
export const ANNOUNCE_TYPE_SELECT_CLASS: Record<AnnounceType, string> = {
  NORMAL_SHIPMENT: `${STATUS_CHIP_CLASS.NORMAL_SHIPMENT} hover:bg-status-normal/40 focus:bg-status-normal/40 focus:text-status-normal-foreground`,
  LIMITED_SHIPMENT: `${STATUS_CHIP_CLASS.LIMITED_SHIPMENT} hover:bg-status-limited/40 focus:bg-status-limited/40 focus:text-status-limited-foreground`,
  SHIPMENT_SUSPENDED: `${STATUS_CHIP_CLASS.SHIPMENT_SUSPENDED} hover:bg-status-stop/40 focus:bg-status-stop/40 focus:text-status-stop-foreground`,
  DISCONTINUED_SALE: `${STATUS_CHIP_CLASS.DISCONTINUED_SALE} hover:bg-status-discontinued/40 focus:bg-status-discontinued/40 focus:text-status-discontinued`,
  TRANSFER_OF_SALE: `${STATUS_CHIP_CLASS.TRANSFER_OF_SALE} hover:bg-status-transfer/40 focus:bg-status-transfer/40 focus:text-status-transfer-foreground`,
}



/** 包装情報の初期値 */
export const DEFAULT_PACKAGE_UNIT: CreatePackageUnitFormInput = {
  publishStatus: PublishStatus.DRAFT,
  name: "",
  breakdown: "",
  variant: "",
  currentShippingStatus: "",
  unifiedCode: "",
  gs1DispensingCode: "",
  gs1SalesCode: "",
  hotCode: "",
  salesTransferDate: null,
  discontinuedDate: null,
}

/** 医薬品新規登録フォーム全体の初期値 */
export const DEFAULT_DRUG_FORM_VALUES: CreateDrugFormInput = {
  name: "",
  genericNameId: "",
  price: "",
  unitId: "",
  yjCode: "",
  drugPriceListingCode: "",
  productType: "",
  salesCompanyId: "",
  manufacturingCompanyId: "",
  isSelectMedical: false,
  isAuthorizedGeneric: false,
  packageUnits: [DEFAULT_PACKAGE_UNIT],
}