import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { adminAuthCheck } from "@/app/api/admin/_lib/adminAuthCheck"
import type { PackageUnitDetailResponse } from "@/types/admin/drug"


// 包装情報・告示履歴・製品情報を取得
export const GET = async (
  request: NextRequest,
  { params }: { params: { drugId: string; packageUnitId: string } }
) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ error }, { status })

  const { packageUnitId } = params;

  try {
    const packageUnit = await prisma.packageUnit.findUnique({
      where: { 
        id: parseInt(packageUnitId),  
      },
      include: {
        AnnounceHistories: {
          orderBy: { announcedDate: "desc" }
        },
        Drug: {
          select: {
            id: true,
            name: true,
            yjCode: true,
            GenericName: { select: { id: true, name: true } },
            SalesCompany: { select: { id: true, name: true } },
            ManufacturingCompany: { select: { id: true, name: true } },
          }
        }
      }
    })

    if (!packageUnit) {
      return NextResponse.json(
        { message: "包装情報が見つかりません" },
        { status: 404 }
      )
    }

    const responseData = {
      ...packageUnit,
      salesTransferDate: packageUnit.salesTransferDate?.toISOString() ?? null,
      discontinuedDate: packageUnit.discontinuedDate?.toISOString() ?? null,
      transitionalMeasuresDate: packageUnit.transitionalMeasuresDate?.toISOString() ?? null,
      AnnounceHistories: packageUnit.AnnounceHistories.map((h) => ({
        ...h,
        announcedDate: h.announcedDate?.toISOString() ?? null,
        effectiveDate: h.effectiveDate?.toISOString() ?? null,
      }))
    }
    
    return NextResponse.json<PackageUnitDetailResponse>(
      { data: responseData },
      { status: 200 }
    )

  } catch (error) {
    return NextResponse.json({ message: "データの処理中にエラーが発生しました"}, { status: 500 })
  }
}

