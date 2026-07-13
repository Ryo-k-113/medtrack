import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { adminAuthCheck } from "@/app/api/admin/_lib/adminAuthCheck"
import type { GetDraftPackageUnitsResponse } from "@/types/admin/draft"


/** GET: 下書き包装一覧取得 */
export const GET = async (request: NextRequest) => {
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ error }, { status })

  try {
    const packageUnits = await prisma.packageUnit.findMany({
      where: { publishStatus: "DRAFT" },
      select: {
        id: true,
        name: true,
        currentShippingStatus: true,
        publishStatus: true,
        gs1SalesCode: true,
        gs1DispensingCode: true,
        unifiedCode: true,
        hotCode: true,
        janCode: true,
        discontinuedDate: true,
        salesTransferDate: true,
        DrugId: true,
        Drug: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: { id: "desc" }
    })

    const draftPackageUnits = packageUnits.map((packageUnit) => ({
      ...packageUnit,
      discontinuedDate: packageUnit.discontinuedDate?.toISOString() ?? null,
      salesTransferDate: packageUnit.salesTransferDate?.toISOString() ?? null,
    }))

    return NextResponse.json<GetDraftPackageUnitsResponse>(
      { draftPackageUnits },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { message: "データの取得中にエラーが発生しました" },
      { status: 500 }
    )
  }
}