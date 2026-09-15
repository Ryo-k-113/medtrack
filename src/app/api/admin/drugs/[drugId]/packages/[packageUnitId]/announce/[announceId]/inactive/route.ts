import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminUser } from "@/app/api/admin/_lib/getAdminUser"
import type { InactivateAnnounceRequest, InactivateAnnounceResponse } from "@/types/admin/drug"



/** POST: 告示の非表示（INACTIVE化）（processStatusがCOMPLETED、かつ非表示化されていない場合）*/
export const POST = async (
  request: NextRequest,
  { params }: { params: { drugId: string; packageUnitId: string; announceId: string; }}
) => {

  // 認証チェック
  const { errorResponse } = await getAdminUser()
  if (errorResponse) return errorResponse

  const { drugId, packageUnitId, announceId } = params

  try {
    const body: InactivateAnnounceRequest = await request.json()

    // 出荷状況をbodyから取得
    const { currentShippingStatus } = body

    await prisma.$transaction(async (tx) => {
      // バッチで出荷状況に反映済み（COMPLETED）、かつ非表示化されていない告示のみINACTIVEに
      const result = await tx.shippingAnnouncement.updateMany({
        where: {
          id: Number(announceId),
          packageUnitId: Number(packageUnitId),
          PackageUnit: {
            drugId: Number(drugId)
          },
          processStatus: "COMPLETED",
          publishStatus: { not: "INACTIVE" },
        },
        data: { publishStatus: "INACTIVE" }
      })

      // 条件に一致する告示がない（IDの組み合わせが不整合、未処理、非表示化済み）場合はエラー
      if (result.count === 0) {
        throw new Error("NOT_FOUND")
      }

      // 出荷状況の修正が必要な場合
      if (currentShippingStatus) {
        await tx.packageUnit.update({
          where: {
            id: Number(packageUnitId),
            drugId: Number(drugId)
          },
          data: { currentShippingStatus }
        })
      }
    })

    return NextResponse.json<InactivateAnnounceResponse>(
      { message: "告示を非表示にしました" },
      { status: 200 }
    )

  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return NextResponse.json({ message: "対象の告示は非表示にできません" }, { status: 404 })
    }
    if (error) {
      return NextResponse.json({ message: "エラーが発生しました" }, { status: 400 })
    }
  }
}
