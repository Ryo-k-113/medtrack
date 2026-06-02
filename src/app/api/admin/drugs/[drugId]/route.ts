import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client"
import { adminAuthCheck } from "@/app/api/admin/_lib/adminAuthCheck";
import { toUTCDate } from "@/utils/date";


// 製品情報と包装情報一覧を取得
export const GET = async (request: NextRequest, { params }: { params: { drugId: string } }) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request);
  if(!isAuthorized) return NextResponse.json({ error },{ status });
  
  const { drugId } = params;

  try {
    const drug = await prisma.drug.findUnique({
      where: { 
        id: parseInt(drugId), 
      },
      include: {
        GenericName: { 
          select: { id: true, name: true } 
        },
        Unit: { 
          select: { id: true, name: true } 
        },
        ManufacturingCompany: { 
          select: { id: true, name: true } 
        },
        SalesCompany: { 
          select: { id: true, name: true } 
        },
        // 包装情報の表示項目
        PackageUnits: {
          select: {
            id: true,
            name: true,
            gs1SalesCode: true,
            unifiedCode: true,
            currentShippingStatus: true,
            publishStatus: true,
          }
        }
      }
    })
    if (!drug) {
      return NextResponse.json(
        { message: "製品が見つかりません" },
        { status: 404 }
      )
    }
    return NextResponse.json({ drug }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}


// 製品情報の更新
export const PUT = async (
  request: NextRequest,
  { params }: { params: { drugId: string } }
) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ error }, { status })
   
  const { drugId } = params;

  try {
    const body = await request.json()

    const {
      name,
      price,
      drugPriceListingCode,
      yjCode,
      isSelectMedical,
      isAuthorizedGeneric,
      packageInsertUrl,
      productType,
      GenericNameId,
      UnitId,
      ManufacturingCompanyId,
      SalesCompanyId,
    } = body

    const updatedDrug = await prisma.drug.update({
      where: { 
        id: parseInt(drugId), 
      },
      data: {
        name,
        price,
        drugPriceListingCode,
        yjCode,
        isSelectMedical,
        isAuthorizedGeneric,
        packageInsertUrl,
        productType,
        GenericNameId,
        UnitId,
        ManufacturingCompanyId,
        SalesCompanyId,
      }
    })

    return NextResponse.json(
      { 
        message: "更新しました", 
        data: updatedDrug 
      },
      { status: 200 }
    )

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "同じYJコードと販売会社の組み合わせが既に登録されています" },
          { status: 409 }
        )
      }
    }
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}


// 製品の削除(包装情報もカスケードで削除)
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { drugId: string } }
) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ error }, { status })
   
  const { drugId } = params;

  try {
    await prisma.drug.delete({
      where: { 
        id: parseInt(drugId),
      }
    })
    return NextResponse.json(
      { message: "製品を削除しました" },
      { status: 200 }
    )

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}

// 製品に新規包装を追加
export const POST = async (
  request: NextRequest,
  { params }: { params: { drugId: string } }
) => {
  // 認証チェック
  const { isAuthorized, error, status } = await adminAuthCheck(request)
  if (!isAuthorized) return NextResponse.json({ error }, { status })
  
  const { drugId } = params;

  try {
    const body = await request.json()

    const {
      name,
      gs1SalesCode,
      gs1DispensingCode,
      hotCode,
      janCode,
      unifiedCode,
      currentShippingStatus,
      publishStatus,
      salesTransferDate,
      discontinuedDate,
      transitionalMeasuresDate,
    } = body

    const newPackageUnit = await prisma.packageUnit.create({
      data: {
        name,
        gs1SalesCode: gs1SalesCode || null,
        gs1DispensingCode: gs1DispensingCode || null,
        hotCode: hotCode || null,
        janCode: janCode || null,
        unifiedCode: unifiedCode || null,
        currentShippingStatus,
        publishStatus,
        salesTransferDate: toUTCDate(salesTransferDate),
        discontinuedDate: toUTCDate(discontinuedDate),
        transitionalMeasuresDate: toUTCDate(transitionalMeasuresDate),
        DrugId: parseInt(drugId),
      }
    })

    return NextResponse.json(
      { 
        message: "包装を追加しました", 
        data: newPackageUnit 
      },
      { status: 201 }
    )

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}