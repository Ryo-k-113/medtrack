import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { adminAuthCheck } from "@/app/api/admin/_lib/adminAuthCheck"
import type { InactivateAnnounceRequest, InactivateAnnounceResponse } from "@/types/admin/drug"



/** POST: 適用日を迎えた告示の非表示（INACTIVE化）*/
export const POST = async (
  request: NextRequest,
  { params }: { params: { drugId: string; packageUnitId: string; announceId: string; }}
) => {

  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ message: error }, { status })

  const { drugId, packageUnitId, announceId } = params

  try {
    const body: InactivateAnnounceRequest = await request.json()

    // 出荷状況をbodyから取得
    const { currentShippingStatus } = body

    await prisma.$transaction(async (tx) => {
      // 対象の告示をINACTIVEに
      const result = await tx.announceHistory.updateMany({
        where: {
          id: Number(announceId),
          packageUnitId: Number(packageUnitId),
          PackageUnit: {
            drugId: Number(drugId)
          },
        },
        data: { publishStatus: "INACTIVE" }
      })

      // 指定された条件に一致するレコードが存在しない（URLのID組み合わせが不整合）場合はエラー
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
      return NextResponse.json({ message: "対象の告示が見つかりません" }, { status: 404 })
    }
    if (error) {
      return NextResponse.json({ message: "エラーが発生しました" }, { status: 400 })
    }
  }
}
