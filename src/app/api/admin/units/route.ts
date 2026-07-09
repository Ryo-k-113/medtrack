import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { GetUnitsResponse, CreateUnitRequest, CreateUnitResponse } from "@/types/admin/unit"
import { adminAuthCheck } from "../_lib/adminAuthCheck";


/** 規格単位一覧の取得 */
export const GET = async (request: NextRequest) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request);

  if(!isAuthorized) return NextResponse.json({ error },{ status });

  try {
    const units = await prisma.unit.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { id: "asc" },
    })

    // 成功レスポンスを返す
    return NextResponse.json<GetUnitsResponse>({ units }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}


/** 規格単位を新規作成 */
export const POST = async (request: NextRequest) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ error }, { status })

  try {
    // リクエストbodyを取得
    const body: CreateUnitRequest = await request.json()
    const { name } = body
    
    // 規格単位をDBに作成
    const unit = await prisma.unit.create({
      data: { name },
    })

    // 成功レスポンスを返す
    return NextResponse.json<CreateUnitResponse>(
      { message: `${unit.name}を作成しました`, data: unit },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { message: "データの作成中にエラーが発生しました" },
      { status: 400 }
    )
  }
}