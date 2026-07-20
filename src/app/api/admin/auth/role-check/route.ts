import { NextRequest, NextResponse } from "next/server"
import { adminAuthCheck } from "@/app/api/admin/_lib/adminAuthCheck"


type AdminCheckRoleResponse = {
  status: string
}

/** 管理者ロールチェック */
export const GET = async (request: NextRequest) => {

  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ error }, { status })

  return NextResponse.json<AdminCheckRoleResponse>({ status: "OK" }, { status: 200 })
}