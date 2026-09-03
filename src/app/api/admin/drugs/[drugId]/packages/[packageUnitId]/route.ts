import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { adminAuthCheck } from "@/app/api/admin/_lib/adminAuthCheck"
import type { PackageUnitDetailResponse, UpdatePackageUnitRequest,
  UpdatePackageUnitResponse, DeletePackageUnitResponse } from "@/types/admin/drug"


/** 包装情報・告示履歴・製品情報を取得 */
export const GET = async (
  request: NextRequest,
  { params }: { params: { drugId: string; packageUnitId: string } }
) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ error }, { status })

  const { packageUnitId, drugId } = params;

  try {
    const packageUnit = await prisma.packageUnit.findUnique({
      where: { 
        id: parseInt(packageUnitId),
        drugId: parseInt(drugId),  
      },
      include: {
        shippingAnnouncements: {
          orderBy: { announcedDate: "desc" }
        },
        Drug: {
          select: {
            id: true,
            name: true,
            yjCode: true,
            transitionalMeasuresDate: true,
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
      createdAt: packageUnit.createdAt.toISOString(),
      updatedAt: packageUnit.updatedAt.toISOString(),
      Drug: {
        ...packageUnit.Drug,
        transitionalMeasuresDate: packageUnit.Drug.transitionalMeasuresDate?.toISOString() ?? null,
      },
      shippingAnnouncements: packageUnit.shippingAnnouncements.map((h) => ({
        ...h,
        announcedDate: h.announcedDate?.toISOString() ?? null,
        effectiveDate: h.effectiveDate?.toISOString() ?? null,
        createdAt: h.createdAt.toISOString(),
        updatedAt: h.updatedAt.toISOString(),
      }))
    }
    
    return NextResponse.json<PackageUnitDetailResponse>(
      { data: responseData },
      { status: 200 }
    )

  } catch {
    return NextResponse.json({ message: "データの処理中にエラーが発生しました"}, { status: 500 })
  }
}



//* 包装情報の更新 */
export const PUT = async (
  request: NextRequest,
  { params }: { params: { drugId: string; packageUnitId: string } }
) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ message: error }, { status })
  
  // 製品IDと包装IDを取得
  const { packageUnitId, drugId } = params;
  
  try {
    // リクエストbodyの取得
    const body: UpdatePackageUnitRequest = await request.json()

    const {
      name,
      publishStatus,
      gs1SalesCode,
      gs1DispensingCode,
      hotCode,
      janCode,
      unifiedCode,
    } = body
    
    // DBの包装情報を更新
    await prisma.packageUnit.update({
      where: { 
        id: parseInt(packageUnitId), 
        drugId: parseInt(drugId), 
      },
      data: {
        name,
        publishStatus,
        gs1SalesCode: gs1SalesCode || null,
        gs1DispensingCode: gs1DispensingCode || null,
        hotCode: hotCode || null,
        janCode: janCode || null,
        unifiedCode: unifiedCode,
      }
    })


    return NextResponse.json<UpdatePackageUnitResponse>(
      { message: "更新しました"},
      { status: 200 }
    )

  } catch {
    return NextResponse.json({ message: "更新中にエラーが発生しました"}, { status: 400 })
  }
}

// 包装の削除（ShippingAnnouncementもカスケード削除）
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { drugId: string; packageUnitId: string } }
) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ error }, { status })

  const { packageUnitId } = params;

  try {
    await prisma.packageUnit.delete({
      where: { id: parseInt(packageUnitId), }
    })

    return NextResponse.json<DeletePackageUnitResponse>(
      { message: "削除しました" },
      { status: 200 }
    )

  } catch  {
    return NextResponse.json({ message: "データの処理中にエラーが発生しました。" }, { status: 500 })
  }
}
