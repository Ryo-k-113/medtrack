import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client"
import type { GetGenericNamesResponse, CreateGenericNameRequest,CreateGenericNameResponse } from "@/types/admin/genericName"
import { adminAuthCheck } from "../_lib/adminAuthCheck";


/** 成分名一覧の取得（offsetページネーション） */
export const GET = async (request: NextRequest) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request);

  if(!isAuthorized) return NextResponse.json({ message: error },{ status });

  try {
    // ページネーションパラメータの取得
    const { searchParams } = new URL(request.url)

    // 現在のページ番号
    const page = Math.max(1, Number(searchParams.get("page")) || 1)

    // 1ページの表示件数
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10))

    // 検索キーワード（成分名で検索）
    const search = searchParams.get("search")?.trim()

    // 基本のwhere条件
    const where: Prisma.GenericNameWhereInput = {
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
    }

    const [genericNames, totalCount] = await Promise.all([
      prisma.genericName.findMany({
        where,
        orderBy: { id: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.genericName.count({ where }),
    ])

    return NextResponse.json<GetGenericNamesResponse>(
      { genericNames, totalCount },
      { status: 200 }
    )
  } catch  {
    return NextResponse.json({ message: "エラーが発生しました" }, { status: 400 })
  }
} 

/**  成分名を新規作成  */
export const POST = async (request: NextRequest) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ message: error }, { status })

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