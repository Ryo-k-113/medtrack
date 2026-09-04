import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminUser } from "@/app/api/admin/_lib/getAdminUser"
import { toUTCDate } from "@/utils/date"
import type { UpdateAnnounceRequest, UpdateAnnounceResponse } from "@/types/admin/drug"


/** PUT: 告示情報の更新（processStatusがPENDING、かつ非表示化されていない場合）*/
export const PUT = async (
  request: NextRequest,
  { params }: { params: { drugId: string; packageUnitId: string; announceId: string } }
) => {
  // 認証チェック
  const { errorResponse } = await getAdminUser(request)
  if (errorResponse) return errorResponse

  const { drugId, packageUnitId, announceId } = params
  const body: UpdateAnnounceRequest = await request.json()
  const { announcedDate, effectiveDate, announceType } = body

  // 告示種別・告示日・適用日は必須
  const announcedAt = toUTCDate(announcedDate)
  const effectiveAt = toUTCDate(effectiveDate)

  if (!announceType || !announcedAt || !effectiveAt) {
    return NextResponse.json(
      { message: "告示種別・告示日・適用日は必須です" },
      { status: 400 }
    )
  }

  try {
    // PENDINGかつ非表示化されていない告示のみ更新対象
    const result = await prisma.shippingAnnouncement.updateMany({
      where: {
        id: Number(announceId),
        packageUnitId: Number(packageUnitId),
        PackageUnit: {
          drugId: Number(drugId)
        },
        processStatus: "PENDING",
        publishStatus: { not: "INACTIVE" },
      },
      data: {
        announcedDate: announcedAt,
        effectiveDate: effectiveAt,
        announceType: announceType,
      }
    })

    // 指定された条件に一致するレコードが存在しない場合はエラー
    if (result.count === 0) {
      return NextResponse.json(
        { message: "対象の告示は編集できません" },
        { status: 404 }
      )
    }

    return NextResponse.json<UpdateAnnounceResponse>(
      { message: "告示を更新しました" },{ status: 200 }
    )
  } catch {
    return NextResponse.json(
      { message: "更新中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
