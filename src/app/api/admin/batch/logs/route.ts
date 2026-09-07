import { NextRequest, NextResponse } from "next/server"
import { BatchJobType } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { getAdminUser } from "@/app/api/admin/_lib/getAdminUser"
import type { GetBatchLogsResponse } from "@/types/admin/batch"

/**
 * 定期実行の履歴取得（offsetページネーション）
 * 全処理の履歴を1つの一覧で扱い、jobTypeが指定された場合のみ処理を絞り込む
 */
export const GET = async (request: NextRequest) => {
  // 認証チェック
  const { errorResponse } = await getAdminUser(request)
  if (errorResponse) return errorResponse

  try {
    const { searchParams } = new URL(request.url)

    // 現在のページ番号
    const page = Math.max(1, Number(searchParams.get("page")) || 1)

    // 1ページの表示件数
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10))

    // 処理の絞り込み（未指定の場合は全処理を対象）
    const jobTypeParam = searchParams.get("jobType")
    const jobType = Object.values(BatchJobType).find((type) => type === jobTypeParam)
    const where = jobType ? { jobType } : {}

    const [logs, totalCount] = await Promise.all([
      prisma.batchProcessingLog.findMany({
        where,
        orderBy: { startedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.batchProcessingLog.count({ where }),
    ])

    // レスポンスデータの変換（Date型をstringへ変換）
    const responseLogs = logs.map((log) => ({
      id: log.id,
      jobType: log.jobType,
      status: log.status,
      processedCount: log.processedCount,
      startedAt: log.startedAt.toISOString(),
      completedAt: log.completedAt?.toISOString() ?? null,
      failedAt: log.failedAt?.toISOString() ?? null,
      errorCode: log.errorCode,
      errorMessage: log.errorMessage,
    }))

    return NextResponse.json<GetBatchLogsResponse>(
      { logs: responseLogs, totalCount },
      { status: 200 }
    )

  } catch {
    return NextResponse.json({ message: "エラーが発生しました" }, { status: 400 })
  }
}
