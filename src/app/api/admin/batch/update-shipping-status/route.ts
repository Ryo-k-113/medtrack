import { NextRequest, NextResponse } from "next/server"
import { getAdminUser } from "@/app/api/admin/_lib/getAdminUser"
import { updateShippingStatus } from "@/app/api/_lib/batch/updateShippingStatus"
import type { RunBatchResponse } from "@/types/admin/batch"

/** 出荷状況の更新の手動実行（管理画面から実行） */
export const POST = async (request: NextRequest) => {
  // 認証チェック
  const { errorResponse } = await getAdminUser(request)
  if (errorResponse) return errorResponse

  const { isSkipped, log } = await updateShippingStatus()

  // レスポンスデータの変換（Date型をstringへ変換）
  const responseLog = {
    id: log.id,
    jobType: log.jobType,
    status: log.status,
    processedCount: log.processedCount,
    startedAt: log.startedAt.toISOString(),
    completedAt: log.completedAt?.toISOString() ?? null,
    failedAt: log.failedAt?.toISOString() ?? null,
    errorCode: log.errorCode,
    errorMessage: log.errorMessage,
  }

  // 実行中の処理があった場合は既存のログを返す
  if (isSkipped) {
    return NextResponse.json<RunBatchResponse>(
      { message: "すでに実行中です。完了までお待ちください", log: responseLog },
      { status: 409 }
    )
  }

  if (log.status === "FAILED") {
    return NextResponse.json<RunBatchResponse>(
      { message: "出荷状況の更新に失敗しました", log: responseLog },
      { status: 500 }
    )
  }

  return NextResponse.json<RunBatchResponse>(
    { message: `出荷状況を更新しました（${log.processedCount}件）`, log: responseLog },
    { status: 200 }
  )
}
