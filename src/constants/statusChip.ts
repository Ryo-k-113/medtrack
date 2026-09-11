import type { AnnounceType } from "@prisma/client"

/**
 * 出荷状況のチップの配色（枠線・淡い背景・文字色）
 * 医薬品の更新情報の絞り込みと、検索結果の出荷状況ガイドで共通に使う
 */
export const STATUS_CHIP_CLASS: Record<AnnounceType, string> = {
  NORMAL_SHIPMENT: "border-status-normal bg-status-normal/20 text-status-normal-foreground",
  LIMITED_SHIPMENT: "border-amber-200 bg-status-limited/20 text-status-limited-foreground",
  SHIPMENT_SUSPENDED: "border-status-stop/70 bg-status-stop/20 text-status-stop-foreground",
  DISCONTINUED_SALE: "border-status-discontinued/50 bg-status-discontinued/20 text-status-discontinued",
  TRANSFER_OF_SALE: "border-blue-300 bg-status-transfer/20 text-status-transfer-foreground",
}
