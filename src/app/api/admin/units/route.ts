import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client"
import type { GetUnitsResponse, CreateUnitRequest, CreateUnitResponse } from "@/types/admin/unit"
import { adminAuthCheck } from "../_lib/adminAuthCheck";


/** 規格単位一覧の取得（offsetページネーション） */
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

    // 検索キーワード（規格単位名で検索）
    const search = searchParams.get("search")?.trim()

    // 基本のwhere条件
    const where: Prisma.UnitWhereInput = {
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
    }

    const [units, totalCount] = await Promise.all([
      prisma.unit.findMany({
        where,
        orderBy: { id: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.unit.count({ where }),
    ])

    // 成功レスポンスを返す
    return NextResponse.json<GetUnitsResponse>(
      { units, totalCount },
      { status: 200 }
    )
  } catch  {
      return NextResponse.json({ message: "エラーが発生しました" }, { status: 400 })
  }
}


/** 規格単位を新規作成 */
export const POST = async (request: NextRequest) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ message: error }, { status })

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