import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export const GET = async () => {
  try {
    const companies = await prisma.pharmaceuticalCompany.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ companies }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}