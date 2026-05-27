import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { GenericNameResponse } from "@/types/admin/drug"

export const GET = async () => {
  try {
    const genericNames = await prisma.genericName.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json<GenericNameResponse>({ genericNames }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}