import type { AnnounceType, CurrentShippingStatus, ProcessStatus } from "@prisma/client"

/** 告知タイプを出荷状況へ変換する */
export const SHIPPING_STATUS_BY_ANNOUNCE_TYPE: Record<AnnounceType, CurrentShippingStatus> = {
  NORMAL_SHIPMENT: "NORMAL_SHIPMENT",
  LIMITED_SHIPMENT: "LIMITED_SHIPMENT",
  SHIPMENT_SUSPENDED: "SHIPMENT_SUSPENDED",
  DISCONTINUED_SALE: "DISCONTINUED_SALE",
  TRANSFER_OF_SALE: "DISCONTINUED_SALE", // 販売移管は販売中止として扱う
}

type ScheduleTarget = {
  announceType: AnnounceType
  effectiveDate: string | null
  isAfterStockDepletion: boolean
  processStatus: ProcessStatus
}

/** 予定のタグに出す告知種別（告知が増えても表示が多くなりすぎないよう、包装がなくなる告知に絞る） */
const SCHEDULE_ANNOUNCE_TYPES: AnnounceType[] = ["DISCONTINUED_SALE", "TRANSFER_OF_SALE"]

/**
 * 予定のタグに出す告知（販売中止・販売移管のみ）を、適用日の早い順に取り出す
 * - 未反映の告知：これからの予定として出す
 * @param announcements - 包装の告知（公開中のもの）
 * @param currentStatus - 包装の現在の出荷状況
 */
export const pickScheduleAnnouncements = <T extends ScheduleTarget>(
  announcements: T[],
  currentStatus: CurrentShippingStatus
): T[] =>
  announcements
    .filter((announcement) => {
      if (!SCHEDULE_ANNOUNCE_TYPES.includes(announcement.announceType)) return false
      if (announcement.processStatus === "PENDING") return true

      const isKeptAfterApplied =
        announcement.announceType === "TRANSFER_OF_SALE" || announcement.isAfterStockDepletion

      return (
        isKeptAfterApplied &&
        SHIPPING_STATUS_BY_ANNOUNCE_TYPE[announcement.announceType] === currentStatus
      )
    })
    .sort((a, b) => (a.effectiveDate ?? "").localeCompare(b.effectiveDate ?? ""))
