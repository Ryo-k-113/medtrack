
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAdminUser } from "@/app/api/admin/_lib/getAdminUser"
import { getUniqueErrorMessage } from "@/app/api/admin/_lib/getUniqueErrorMessage"
import type { UpdateCompanyRequest, UpdateCompanyResponse } from "@/types/admin/company"


/**  製薬会社を更新  */
export const PUT = async (
  request: NextRequest,
  { params }: { params: { companyId: string } }
) => {

  // 認証チェック
  const { errorResponse } = await getAdminUser()
  if (errorResponse) return errorResponse
  
  // 製薬会社IDの取得
  const { companyId } = params;

  try {
    // リクエストbodyを取得
    const body: UpdateCompanyRequest = await request.json()
    const { name } = body

    // DBの製薬会社を更新
    const company = await prisma.pharmaceuticalCompany.update({
      where: { id: parseInt(companyId) },
      data: { name },
    })

    // 成功レスポンスを返す
    return NextResponse.json<UpdateCompanyResponse>(
      { message: "更新しました", data: company },
      { status: 200 }
    )
  } catch (error) {
    // 同じ名前が既に登録されている場合は、その旨を返す
    const uniqueErrorMessage = getUniqueErrorMessage(error)
    if (uniqueErrorMessage) {
      return NextResponse.json({ message: uniqueErrorMessage }, { status: 409 })
    }

    return NextResponse.json(
      { message: "データの更新中にエラーが発生しました" },
      { status: 400 }
    )
  }
}