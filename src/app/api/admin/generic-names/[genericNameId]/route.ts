import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { adminAuthCheck } from "@/app/api/admin/_lib/adminAuthCheck"
import type { UpdateGenericNameRequest, UpdateGenericNameResponse } from "@/types/admin/genericName"


/** 成分名を更新  */
export const PUT = async (
  request: NextRequest,
  { params }: { params: { genericNameId: string } } 
) => {

  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ error }, { status })
  
  // 成分名IDの取得
  const { genericNameId } = params;

  try {
    // リクエストbodyを取得
    const body: UpdateGenericNameRequest = await request.json()
    const { name } = body

    // DBの成分名を更新
    const genericName = await prisma.genericName.update({
      where: { id: parseInt(genericNameId) },
      data: { name },
    })

    // 成功レスポンスを返す
    return NextResponse.json<UpdateGenericNameResponse>(
      { message: "更新しました", data: genericName },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { message: "データの更新中にエラーが発生しました" },
      { status: 400 }
    )
  }
}