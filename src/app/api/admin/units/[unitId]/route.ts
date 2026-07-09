import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { adminAuthCheck } from "@/app/api/admin/_lib/adminAuthCheck"
import type { UpdateUnitRequest, UpdateUnitResponse } from "@/types/admin/unit"


/** 規格単位を更新 */
export const PUT = async (
  request: NextRequest,
  { params }: { params: { unitId: string } } 
) => {

  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ error }, { status })
  
  // 規格単位IDの取得
  const { unitId } = params;

  try {
    // リクエストbodyを取得
    const body: UpdateUnitRequest = await request.json()
    const { name } = body

    // DBの規格単位を更新
    await prisma.unit.update({
      where: { id: parseInt(unitId) },
      data: { name },
    })

    // 成功レスポンスを返す
    return NextResponse.json<UpdateUnitResponse>(
      { message: "更新しました"},
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { message: "データの更新中にエラーが発生しました" },
      { status: 400 }
    )
  }
}