import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CompanyResponse } from "@/types/admin/drug"
import type { CreateCompanyRequest, CreateCompanyResponse } from "@/types/admin/company"
import { adminAuthCheck } from "../_lib/adminAuthCheck";

export const GET = async (request: NextRequest) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request);

  if(!isAuthorized) return NextResponse.json({ error },{ status });

  try {
    const companies = await prisma.pharmaceuticalCompany.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json<CompanyResponse>({ companies }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}


/**  製薬会社を新規作成  */
export const POST = async (request: NextRequest) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ error }, { status })

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
  } catch {
    return NextResponse.json(
      { message: "データの作成中にエラーが発生しました" },
      { status: 400 }
    )
  }
}