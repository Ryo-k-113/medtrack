import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { GetPackageDetailResponse } from "@/types/package"


/** 包装詳細・告知履歴・他の包装形態を取得（公開） */
export const GET = async (
  request: NextRequest,
  { params }: { params: { drugId: string; packageUnitId: string } }
) => {
  const { drugId, packageUnitId } = params

  try {
    const packageUnit = await prisma.packageUnit.findUnique({
      where: {
        id: parseInt(packageUnitId),
        drugId: parseInt(drugId),
        publishStatus: "PUBLISHED",
      },
      select: {
        id: true,
        name: true,
        gs1SalesCode: true,
        gs1DispensingCode: true,
        hotCode: true,
        janCode: true,
        unifiedCode: true,
        currentShippingStatus: true,
        salesTransferDate: true,
        discontinuedDate: true,
        Drug: {
          select: {
            id: true,
            name: true,
            yjCode: true,
            productType: true,
            isSelectMedical: true,
            price: true,
            packageInsertUrl: true,
            Unit: { select: { id: true, name: true } },
            GenericName: { select: { id: true, name: true } },
            SalesCompany: { select: { id: true, name: true } },
            ManufacturingCompany: { select: { id: true, name: true } },
            PackageUnits: {
              where: { publishStatus: "PUBLISHED" },
              select: { id: true, name: true, currentShippingStatus: true },
              orderBy: { id: "asc" },
            },
          },
        },
        shippingAnnouncements: {
          where: { publishStatus: "PUBLISHED" },
          select: { id: true, announcedDate: true, effectiveDate: true, announceType: true },
          orderBy: { announcedDate: "desc" },
        },
      },
    })

    if (!packageUnit) {
      return NextResponse.json(
        { message: "包装情報が見つかりません" },
        { status: 404 }
      )
    }

    // レスポンスデータの変換（Decimal型・Date型を変換）
    const responseData = {
      ...packageUnit,
      salesTransferDate: packageUnit.salesTransferDate?.toISOString() ?? null,
      discontinuedDate: packageUnit.discontinuedDate?.toISOString() ?? null,
      Drug: {
        ...packageUnit.Drug,
        price: packageUnit.Drug.price ? Number(packageUnit.Drug.price) : null,
      },
      shippingAnnouncements: packageUnit.shippingAnnouncements.map((history) => ({
        ...history,
        announcedDate: history.announcedDate?.toISOString() ?? null,
        effectiveDate: history.effectiveDate?.toISOString() ?? null,
      })),
    }

    return NextResponse.json<GetPackageDetailResponse>(
      { data: responseData },
      { status: 200 }
    )

  } catch {
    return NextResponse.json({ message: "データの処理中にエラーが発生しました" }, { status: 500 })
  }
}
