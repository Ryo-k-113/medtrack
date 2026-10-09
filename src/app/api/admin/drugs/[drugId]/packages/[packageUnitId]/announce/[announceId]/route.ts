import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminUser } from "@/app/api/admin/_lib/getAdminUser"
import { toUTCDate } from "@/utils/date"
import type { UpdateAnnounceRequest, UpdateAnnounceResponse } from "@/types/admin/drug"


/** PUT: 告知情報の更新（バッチ処理が未実施(PENDING)かつ非表示ではない告知が対象）*/
export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ drugId: string; packageUnitId: string; announceId: string }> }
) => {
  // 認証チェック
  const { errorResponse } = await getAdminUser()
  if (errorResponse) return errorResponse

  const { drugId, packageUnitId, announceId } = await params
  const body: UpdateAnnounceRequest = await request.json()
  const { announcedDate, effectiveDate, announceType, isAfterStockDepletion } = body

  // 告示種別・告示日・適用日は必須
  const announcedAt = toUTCDate(announcedDate)
  const effectiveAt = toUTCDate(effectiveDate)

  if (!announceType || !announcedAt || !effectiveAt) {
    return NextResponse.json(
      { message: "告知種別・告知日・適用日は必須です" },
      { status: 400 }
    )
  }

  try {
    // トランザクションで告示の更新と包装の販売中止日・販売移管日の更新を同時に行う
    const isUpdated = await prisma.$transaction(async (tx) => {
      // PENDINGかつ非表示化されていない告示のみ更新対象
      const where = {
        id: Number(announceId),
        packageUnitId: Number(packageUnitId),
        PackageUnit: {
          drugId: Number(drugId)
        },
        processStatus: "PENDING" as const,
        publishStatus: { not: "INACTIVE" as const },
      }

      // 種別が変わったかを判定するため、更新前の種別を取得
      const current = await tx.shippingAnnouncement.findFirst({
        where,
        select: { announceType: true },
      })
      if (!current) return false

      await tx.shippingAnnouncement.update({
        where: { id: Number(announceId) },
        data: {
          announcedDate: announcedAt,
          effectiveDate: effectiveAt,
          announceType: announceType,
          isAfterStockDepletion,
        }
      })

      // 販売中止・販売移管の場合は適用日に合わせて日付を更新(告知種別が変わった場合は日付を空に)
      const updateData: Record<string, unknown> = {}
      if (announceType === "DISCONTINUED_SALE") {
        updateData.discontinuedDate = effectiveAt
      } else if (current.announceType === "DISCONTINUED_SALE") {
        updateData.discontinuedDate = null
      }
      if (announceType === "TRANSFER_OF_SALE") {
        updateData.salesTransferDate = effectiveAt
      } else if (current.announceType === "TRANSFER_OF_SALE") {
        updateData.salesTransferDate = null
      }

      if (Object.keys(updateData).length > 0) {
        await tx.packageUnit.update({
          where: { id: Number(packageUnitId) },
          data: updateData,
        })
      }

      return true
    })

    // 指定された条件に一致するレコードが存在しない場合はエラー
    if (!isUpdated) {
      return NextResponse.json(
        { message: "対象の告知は編集できません" },
        { status: 404 }
      )
    }

    return NextResponse.json<UpdateAnnounceResponse>(
      { message: "告知を更新しました" },{ status: 200 }
    )
  } catch {
    return NextResponse.json(
      { message: "更新中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
