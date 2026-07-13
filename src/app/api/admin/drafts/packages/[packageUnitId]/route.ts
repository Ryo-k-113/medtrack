import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { adminAuthCheck } from "@/app/api/admin/_lib/adminAuthCheck"
import type { PublishPackageUnitResponse } from "@/types/admin/draft"


/** 下書きの包装を公開する */
export const PATCH = async (
  request: NextRequest,
  { params }: { params: { packageUnitId: string } }
) => {
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ error }, { status })
  
  // 包装IDを取得
  const packageUnitId = params.packageUnitId

  try {
    // 対象の包装を公開ステータスへ変更
    const updated = await prisma.packageUnit.update({
      where: { id: parseInt(packageUnitId) },
      data: { publishStatus: "PUBLISHED" },
      select: {
        id: true,
        name: true,               
        Drug: {
          select: {
            id: true,
            name: true,  
          }
        }
      }
    })

    // 成功レスポンス
    return NextResponse.json<PublishPackageUnitResponse>(
      { message: "公開しました", data: updated},
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { message: "公開処理中にエラーが発生しました" },
      { status: 400 }
    )
  }
}