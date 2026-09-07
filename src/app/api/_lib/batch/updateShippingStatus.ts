import type { AnnounceType, BatchProcessingLog, CurrentShippingStatus } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { toBatchError } from "@/app/api/_lib/batch/toBatchError"
import { STUCK_RUNNING_MINUTES } from "@/constants/batch"
import { getJstToday } from "@/utils/date"


/** 告知タイプを出荷状況へ変換する */
const SHIPPING_STATUS_BY_ANNOUNCE_TYPE: Record<AnnounceType, CurrentShippingStatus> = {
  NORMAL_SHIPMENT: "NORMAL_SHIPMENT",
  LIMITED_SHIPMENT: "LIMITED_SHIPMENT",
  SHIPMENT_SUSPENDED: "SHIPMENT_SUSPENDED",
  DISCONTINUED_SALE: "DISCONTINUED_SALE",
  TRANSFER_OF_SALE: "DISCONTINUED_SALE", // 販売移管は販売中止として扱う
}


/** 出荷状況の更新の実行結果 */
export type UpdateShippingStatusResult = {
  isSkipped: boolean  //実行中の処理があればtrue
  log: BatchProcessingLog  
}


/**
 * 適用日が到来した告知を包装の出荷状況へ反映
 * 1件でも失敗した場合は更新を中止（管理画面で手動実行）
 * @returns 実行結果を記録した処理履歴
 */

export const updateShippingStatus = async (): Promise<UpdateShippingStatusResult> => {
  // 強制終了などで完了・失敗に記録されずに残ったログを、失敗として確定
  await prisma.batchProcessingLog.updateMany({
    where: {
      status: "RUNNING",
      startedAt: { lt: new Date(Date.now() - STUCK_RUNNING_MINUTES * 60 * 1000) },
    },
    data: {
      status: "FAILED",
      failedAt: new Date(),
      errorCode: "INTERRUPTED",
      errorMessage: "処理が中断されました。",
    },
  })

  // 実行中の処理が残っている場合は、そのログを返す
  const runningJob = await prisma.batchProcessingLog.findFirst({
    where: { jobType: "UPDATE_SHIPPING_STATUS", status: "RUNNING" },
  })

  if (runningJob) return { isSkipped: true, log: runningJob }

  // 実行開始を記録
  const log = await prisma.batchProcessingLog.create({
    data: { 
      jobType: "UPDATE_SHIPPING_STATUS", 
      status: "RUNNING" 
    },
  })

  try {
    // 適用日が到来した未処理の告知を取得
    const announcements = await prisma.shippingAnnouncement.findMany({
      where: {
        processStatus: "PENDING",
        publishStatus: "PUBLISHED",
        effectiveDate: { lte: getJstToday() },
      },
      select: { id: true, announceType: true, packageUnitId: true },
      orderBy: [{ effectiveDate: "asc" }, { id: "asc" }],
    })

    // 1件でも失敗したら全て巻き戻す
    await prisma.$transaction([
      // 包装の出荷状況を告知の内容へ更新
      ...announcements.map((announcement) =>
        prisma.packageUnit.update({
          where: { id: announcement.packageUnitId },
          data: {
            currentShippingStatus:
              SHIPPING_STATUS_BY_ANNOUNCE_TYPE[announcement.announceType],
          },
        })
      ),

      // 反映した告知をまとめて適用済みにする
      prisma.shippingAnnouncement.updateMany({
        where: { id: { in: announcements.map((announcement) => announcement.id) } },
        data: { processStatus: "COMPLETED" },
      }),
    ])

    // 完了を記録
    const completedLog = await prisma.batchProcessingLog.update({
      where: { id: log.id },
      data: {
        status: "COMPLETED",
        processedCount: announcements.length,
        completedAt: new Date(),
      },
    })

    return { isSkipped: false, log: completedLog }

  } catch (error) {

    // エラー時のコードとメッセージを記録
    const { code, message } = toBatchError(error)

    // 失敗を記録
    const failedLog = await prisma.batchProcessingLog.update({
      where: { id: log.id },
      data: {
        status: "FAILED",
        processedCount: 0,
        failedAt: new Date(),
        errorCode: code,
        errorMessage: message,
      },
    })

    return { isSkipped: false, log: failedLog }
  }
}
