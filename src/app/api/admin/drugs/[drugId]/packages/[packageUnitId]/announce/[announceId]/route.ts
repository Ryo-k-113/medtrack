import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { adminAuthCheck } from "@/app/api/admin/_lib/adminAuthCheck"
import { toUTCDate } from "@/utils/date"
import type { UpdateAnnounceRequest, UpdateAnnounceResponse } from "@/types/admin/drug"


/** PUT: 告示情報の更新（processStatusがPENDING、かつ非表示化されていない場合）*/
export const PUT = async (
  request: NextRequest,
  { params }: { params: { drugId: string; packageUnitId: string; announceId: string } }
) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ message: error }, { status })

  const { drugId, packageUnitId, announceId } = params
  const body: UpdateAnnounceRequest = await request.json()
  const { announcedDate, effectiveDate, announceType } = body

  try {
    // PENDINGかつ非表示化されていない告示のみ更新対象
    const result = await prisma.announceHistory.updateMany({
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
        announcedDate: toUTCDate(announcedDate),
        effectiveDate: toUTCDate(effectiveDate),
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

    const updated = await prisma.announceHistory.findUniqueOrThrow({
      where: { id: Number(announceId) },
    })

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
