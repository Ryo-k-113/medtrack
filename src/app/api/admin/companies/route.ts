import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CompanyResponse } from "@/types/admin/drug"
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