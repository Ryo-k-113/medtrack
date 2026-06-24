
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { adminAuthCheck } from "@/app/api/admin/_lib/adminAuthCheck"
import { toUTCDate } from "@/utils/date"
import type { CreateAnnounceRequest, CreateAnnounceResponse } from "@/types/admin/drug"

export const POST = async (
  request: NextRequest,
  { params }: { params: { drugId: string; packageUnitId: string } }
) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ error }, { status })

  const { packageUnitId } = params;

  try {
    const body: CreateAnnounceRequest = await request.json()
    const { announceType, announcedDate, effectiveDate } = body

    // トランザクションで告示履歴の追加とPackageUnitの更新を同時に行う
    const result = await prisma.$transaction(async (tx) => {

      // 告示履歴を追加
      const history = await tx.announceHistory.create({
        data: {
          announceType,
          announcedDate: toUTCDate(announcedDate),
          effectiveDate: toUTCDate(effectiveDate),
          PackageUnitId: parseInt(packageUnitId),
        }
      })

      // 販売中止・販売移管の場合は日付を更新
      const updateData: Record<string, unknown> = {}
      if (announceType === "DISCONTINUED_SALE") {
        updateData.discontinuedDate = toUTCDate(effectiveDate)
      }
      if (announceType === "TRANSFER_OF_SALE") {
        updateData.salesTransferDate = toUTCDate(effectiveDate)
      }

      if (Object.keys(updateData).length > 0) {
        await tx.packageUnit.update({
          where: { id: parseInt(packageUnitId) },
          data: updateData,
        })
      }

      return history
    })

    const responseData = {
      ...result,
      // Dateオブジェクトとして返ってきた日付を stringに変換
      announcedDate: result.announcedDate?.toISOString() ?? null,
      effectiveDate: result.effectiveDate?.toISOString() ?? null,
    }

    return NextResponse.json<CreateAnnounceResponse>(
      { message: "告示を登録しました", data: responseData },
      { status: 201 }
    )

  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}