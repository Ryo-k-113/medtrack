import type { BatchJobType } from "@prisma/client"


/**
 * 定期実行の処理名
 * カードのタイトルや実行履歴の表示に共通で使う
 */
export const BATCH_JOB_TYPE_LABEL: Record<BatchJobType, string> = {
  UPDATE_SHIPPING_STATUS: "出荷状況の更新",
}


/**
 * 実行中のまま滞留していると判断するまでの時間（分）
 * 関数が強制終了された際にRUNNINGを検知
 */
export const STUCK_RUNNING_MINUTES = 30



/**
 * 最終実行が古いと判断するまでの時間（時間）
 * 定期実行が発火していない可能性
 */
export const STALE_LAST_RUN_HOURS = 12
