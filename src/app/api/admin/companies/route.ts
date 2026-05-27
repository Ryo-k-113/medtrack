import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { CompanyResponse } from "@/types/admin/drug"

export const GET = async () => {
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