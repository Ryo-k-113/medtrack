
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminUser } from "@/app/api/admin/_lib/getAdminUser"
import { toUTCDate } from "@/utils/date"
import type { CreateAnnounceRequest, CreateAnnounceResponse } from "@/types/admin/drug"


/** 告示履歴の登録 */
export const POST = async (
  request: NextRequest,
  { params }: { params: { drugId: string; packageUnitId: string } }
) => {
  // 認証チェック
  const { errorResponse } = await getAdminUser(request)
  if (errorResponse) return errorResponse

  const { packageUnitId } = params;

  try {
    const body: CreateAnnounceRequest = await request.json()
    const { announceType, announcedDate, effectiveDate } = body

    // 告示種別・告示日・適用日は必須
    const announcedAt = toUTCDate(announcedDate)
    const effectiveAt = toUTCDate(effectiveDate)

    if (!announceType || !announcedAt || !effectiveAt) {
      return NextResponse.json(
        { message: "告示種別・告示日・適用日は必須です" },
        { status: 400 }
      )
    }

    // トランザクションで告示履歴の追加とPackageUnitの更新を同時に行う
    await prisma.$transaction(async (tx) => {

      // 告示履歴を追加
      const history = await tx.shippingAnnouncement.create({
        data: {
          announceType,
          announcedDate: announcedAt,
          effectiveDate: effectiveAt,
          packageUnitId: parseInt(packageUnitId),
        }
      })

      // 販売中止・販売移管の場合は日付を更新
      const updateData: Record<string, unknown> = {}
      if (announceType === "DISCONTINUED_SALE") {
        updateData.discontinuedDate = effectiveAt
      }
      if (announceType === "TRANSFER_OF_SALE") {
        updateData.salesTransferDate = effectiveAt
      }

      if (Object.keys(updateData).length > 0) {
        await tx.packageUnit.update({
          where: { id: parseInt(packageUnitId) },
          data: updateData,
        })
      }

      return history
    })

    return NextResponse.json<CreateAnnounceResponse>(
      { message: "告示情報を登録しました"},
      { status: 201 }
    )

  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}