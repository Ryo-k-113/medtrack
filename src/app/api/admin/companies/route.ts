import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client"
import type {  GetCompaniesResponse, CreateCompanyRequest, CreateCompanyResponse } from "@/types/admin/company"
import { getAdminUser } from "@/app/api/admin/_lib/getAdminUser"
import { getUniqueErrorMessage } from "@/app/api/admin/_lib/getUniqueErrorMessage"


/**
 * 製薬会社一覧の取得
 * limit を指定しない場合は全件を返す（製薬会社の管理画面）
 * search・limit を指定した場合は、名前で絞り込んで上限まで返す（医薬品フォームの選択欄）
 */
export const GET = async (request: NextRequest) => {

  // 認証チェック
  const { errorResponse } = await getAdminUser()
  if (errorResponse) return errorResponse

  try {
    const { searchParams } = new URL(request.url)

    // 取得件数の上限（未指定なら全件）
    const limitParam = searchParams.get("limit")
    const limit = limitParam ? Math.min(50, Math.max(1, Number(limitParam) || 10)) : undefined

    // 検索キーワード（会社名で検索）
    const search = searchParams.get("search")?.trim()

    const where: Prisma.PharmaceuticalCompanyWhereInput = {
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
    }

    const [companies, totalCount] = await Promise.all([
      prisma.pharmaceuticalCompany.findMany({
        where,
        orderBy: { id: "asc" },
        take: limit,
      }),
      prisma.pharmaceuticalCompany.count({ where }),
    ])

    // レスポンスを返す
    return NextResponse.json<GetCompaniesResponse>({ companies, totalCount }, { status: 200 })
    
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}


/**  製薬会社を新規作成  */
export const POST = async (request: NextRequest) => {
  // 認証チェック
  const { errorResponse } = await getAdminUser()
  if (errorResponse) return errorResponse

  try {
    // リクエストbodyを取得
    const body: CreateCompanyRequest = await request.json()
    const { name } = body
    
    // 製薬会社をDBに作成
    const company = await prisma.pharmaceuticalCompany.create({
      data: { name },
    })

    // 成功レスポンスを返す
    return NextResponse.json<CreateCompanyResponse>(
      { message: `${company.name}を作成しました`, data: company },
      { status: 200 }
    )
  } catch (error) {
    // 同じ名前が既に登録されている場合は、その旨を返す
    const uniqueErrorMessage = getUniqueErrorMessage(error)
    if (uniqueErrorMessage) {
      return NextResponse.json({ message: uniqueErrorMessage }, { status: 409 })
    }

    return NextResponse.json(
      { message: "データの作成中にエラーが発生しました" },
      { status: 400 }
    )
  }
}