import { NextRequest, NextResponse } from "next/server"
import { updateShippingStatus } from "@/app/api/_lib/batch/updateShippingStatus"
import { toBatchError } from "@/app/api/_lib/batch/toBatchError"
import type { CronBatchResponse } from "@/types/admin/batch"


/**  出荷状況の定期更新（Vercel Cronから実行） */
export const GET = async (request: NextRequest) => {
  const authHeader = request.headers.get("Authorization")

  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "認証が必要です" }, { status: 401 })
  }

  try {
    const { isSkipped, log } = await updateShippingStatus()


    const responseLog = {
      processedCount: log.processedCount,
      errorCode: log.errorCode,
      errorMessage: log.errorMessage,
    }

    // 実行中の処理があった場合はスキップ
    if (isSkipped) {
      return NextResponse.json<CronBatchResponse>(
        { message: "すでに実行中のため処理をスキップしました", ...responseLog },
        { status: 409 }
      )
    }

    // ステータスに応じてレスポンスを返す
    if (log.status === "FAILED") {
      return NextResponse.json<CronBatchResponse>(
        { message: "出荷状況の更新に失敗しました", ...responseLog },
        { status: 500 }
      )
    }

    return NextResponse.json<CronBatchResponse>(
      { message: "出荷状況を更新しました", ...responseLog },
      { status: 200 }
    )

  } catch (error) {
    console.error("[cron/update-shipping-status] 実行に失敗しました", error)

    const { code, message } = toBatchError(error)

    return NextResponse.json<CronBatchResponse>(
      {
        message: "実行結果を記録できませんでした",
        processedCount: 0,
        errorCode: code,
        errorMessage: message,
      },
      { status: 500 }
    )
  }
}
