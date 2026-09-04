import { NextRequest, NextResponse } from "next/server"
import { getAdminUser } from "@/app/api/admin/_lib/getAdminUser"


type AdminCheckRoleResponse = {
  status: string
}

/** 管理者ロールチェック */
export const GET = async (request: NextRequest) => {

  const { errorResponse } = await getAdminUser(request)
  if (errorResponse) return errorResponse

  return NextResponse.json<AdminCheckRoleResponse>({ status: "OK" }, { status: 200 })
}