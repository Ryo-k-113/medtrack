import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/app/api/admin/_lib/getAdminUser"
import { getUniqueErrorMessage } from "@/app/api/admin/_lib/getUniqueErrorMessage"
import { toUTCDate } from "@/utils/date";
import type {
  GetDrugEditResponse,
  UpdateDrugRequest,
  UpdateDrugResponse,
  DeleteDrugResponse,
  AddPackageUnitRequest,
  AddPackageUnitResponse,
} from "@/types/admin/drug"


/** 医薬品情報と包装情報一覧を取得 */ 
export const GET = async (request: NextRequest, { params }: { params: { drugId: string } }) => {
  // 認証チェック
  const { errorResponse } = await getAdminUser()
  if (errorResponse) return errorResponse
  
  const { drugId } = params;

  try {
    const drug = await prisma.drug.findUnique({
      where: { 
        id: parseInt(drugId), 
      },
      include: {
        // 包装情報の表示項目
        PackageUnits: {
          select: {
            id: true,
            name: true,
            gs1SalesCode: true,
            unifiedCode: true,
            currentShippingStatus: true,
            publishStatus: true,
          },
          orderBy: {
            id: "asc", 
          },
        },
      },
    })

    // 早期リターン
    if (!drug) {
      return NextResponse.json(
        { message: "製品が見つかりません" },
        { status: 404 }
      )
    }

    // レスポンスデータの変換
    const responseData = {
      ...drug,
      price: drug.price ? Number(drug.price) : null,
      transitionalMeasuresDate: drug.transitionalMeasuresDate?.toISOString() ?? null,
      createdAt: drug.createdAt.toString(),
      updatedAt: drug.updatedAt.toString()
    }

    // 成功レスポンス
    return NextResponse.json<GetDrugEditResponse>(
      { data: responseData }, 
      { status: 200 }
    )
  } catch  {
    return NextResponse.json(
      { message: "データの処理中にエラーが発生しました。" }, 
      { status: 500 }
    )
  }
} 


/** 医薬品の更新 */
export const PUT = async (
  request: NextRequest,
  { params }: { params: { drugId: string } }
) => {
  // 認証チェック
  const { errorResponse } = await getAdminUser()
  if (errorResponse) return errorResponse
   
  const { drugId } = params;

  try {
    const body: UpdateDrugRequest = await request.json()

    const {
      name,
      price,
      drugPriceListingCode,
      yjCode,
      isSelectMedical,
      isAuthorizedGeneric,
      packageInsertUrl,
      productType,
      transitionalMeasuresDate,
      genericNameId,
      unitId,
      manufacturingCompanyId,
      salesCompanyId,
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
        transitionalMeasuresDate,
        genericNameId,
        unitId,
        manufacturingCompanyId,
        salesCompanyId,
      }
    })
     

    // 成功レスポンス
    return NextResponse.json<UpdateDrugResponse>(
      { message: `${updatedDrug.name}を更新しました`},
      { status: 200 }
    )

  } catch (error) {
    // 一意制約の違反は、重複した項目が分かるメッセージを返す
    const uniqueErrorMessage = getUniqueErrorMessage(error)
    if (uniqueErrorMessage) {
      return NextResponse.json({ message: uniqueErrorMessage }, { status: 409 })
    }

    return NextResponse.json({ message: "データの処理中にエラーが発生しました。"}, { status: 500 })
  }
}


/** 医薬品の削除(包装情報もカスケードで削除) */
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { drugId: string } }
) => {
  // 認証チェック
  const { errorResponse } = await getAdminUser()
  if (errorResponse) return errorResponse
   
  const { drugId } = params;

  try {
    await prisma.drug.delete({
      where: { 
        id: parseInt(drugId),
      }
    })

    // 成功レスポンス
    return NextResponse.json<DeleteDrugResponse>(
      { message: "製品を削除しました" },
      { status: 200 }
    )

  } catch {
    return NextResponse.json({ message: "データの処理中にエラーが発生しました。" }, { status: 500 })
}
}

/** 医薬品に新規包装を追加 */
export const POST = async (
  request: NextRequest,
  { params }: { params: { drugId: string } }
) => {
  // 認証チェック
  const { errorResponse } = await getAdminUser()
  if (errorResponse) return errorResponse
  
  const { drugId } = params;

  try {
    const body: AddPackageUnitRequest = await request.json()

    const {
      name,
      gs1SalesCode,
      gs1DispensingCode,
      hotCode,
      unifiedCode,
      currentShippingStatus,
      publishStatus,
      salesTransferDate,
      discontinuedDate,
    } = body

    // DBに新規包装を追加
    const newPackageUnit = await prisma.packageUnit.create({
      data: {
        name,
        gs1SalesCode,
        gs1DispensingCode: gs1DispensingCode || null,
        hotCode: hotCode || null,
        unifiedCode: unifiedCode || null,
        currentShippingStatus,
        publishStatus,
        salesTransferDate: toUTCDate(salesTransferDate),
        discontinuedDate: toUTCDate(discontinuedDate),
        drugId: parseInt(drugId),
      }
    })

    // 成功レスポンス
    return NextResponse.json<AddPackageUnitResponse>(
      { message: `${newPackageUnit.name}を作成しました`},
      { status: 201 }
    )

  } catch (error) {
    // 一意制約の違反は、重複した項目が分かるメッセージを返す
    const uniqueErrorMessage = getUniqueErrorMessage(error)
    if (uniqueErrorMessage) {
      return NextResponse.json({ message: uniqueErrorMessage }, { status: 409 })
    }

    return NextResponse.json(
      { message: "データの処理中にエラーが発生しました。"}, 
      { status: 500 }
    )
  }
}