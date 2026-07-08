import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { GetGenericNamesResponse, CreateGenericNameRequest,CreateGenericNameResponse } from "@/types/admin/genericName"
import { adminAuthCheck } from "../_lib/adminAuthCheck";


/** 成分名一覧の取得 */
export const GET = async (request: NextRequest) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request);

  if(!isAuthorized) return NextResponse.json({ error },{ status });

  try {
    const genericNames = await prisma.genericName.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { id: "asc" },
    })

    return NextResponse.json<GetGenericNamesResponse>({ genericNames }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

/**  成分名を新規作成  */
export const POST = async (request: NextRequest) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ error }, { status })

  try {
    // リクエストbodyを取得
    const body: CreateGenericNameRequest = await request.json()
    const { name } = body
    
    // 製薬会社をDBに作成
    const genericName = await prisma.genericName.create({
      data: { name },
    })

    // 成功レスポンスを返す
    return NextResponse.json<CreateGenericNameResponse>(
      { message: `${genericName.name}を作成しました`, data: genericName },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { message: "データの作成中にエラーが発生しました" },
      { status: 400 }
    )
  }
}