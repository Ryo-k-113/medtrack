import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { GetUnitsResponse } from "@/types/admin/unit"
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