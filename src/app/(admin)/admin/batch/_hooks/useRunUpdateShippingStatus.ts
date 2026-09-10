"use client"

import { useState } from "react"
import { mutate as globalMutate } from "swr"
import { toast } from "sonner"
import { fetcher } from "@/utils/fetcher"
import { BATCH_LOGS_API_PATH } from "@/constants/batch"

/** 出荷状況の更新を手動実行するエンドポイント */
const RUN_UPDATE_SHIPPING_STATUS_URL = "/api/admin/batch/update-shipping-status"

/**
 * 実行履歴のキャッシュをまとめて再取得する
 * 一覧とカード用の最新結果の両方を対象にする
 * （useDataFetchのキーはURLの文字列のため、前方一致で判定する）
 */
const revalidateBatchLogs = () =>
  globalMutate(
    (key) => typeof key === "string" && key.startsWith(BATCH_LOGS_API_PATH)
  )

/**
 * 出荷状況の更新を手動で実行するカスタムフック
 * @returns 実行関数、実行中の判定
 */
export const useRunUpdateShippingStatus = () => {
  const [isRunning, setIsRunning] = useState(false)

  /** 出荷状況の更新を手動で実行する */
  const runUpdateShippingStatus = async () => {
    setIsRunning(true)

    try {
      const result = await fetcher({
        url: RUN_UPDATE_SHIPPING_STATUS_URL,
        method: "POST",
      })
      toast.success(result.message)

    } catch (error) {
      // 失敗時もログは記録されるため、履歴を更新したうえで通知
      toast.error(
        error instanceof Error ? error.message : "実行中にエラーが発生しました"
      )
    } finally {
      // 実行結果を履歴とカードの両方へ反映
      await revalidateBatchLogs()
      setIsRunning(false)
    }
  }

  return { runUpdateShippingStatus, isRunning }
}
