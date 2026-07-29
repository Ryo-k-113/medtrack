import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminAuthCheck } from "@/app/api/admin/_lib/adminAuthCheck";
import  { CreateDrugRequest, CreateDrugResponse,GetPublishedPackageUnitsResponse  } from '@/types/admin/drug';
import { Prisma } from "@prisma/client"


//** 公開済みの医薬品情報一覧を取得 */
export const GET = async (request: NextRequest) => {
    // 認証チェック
    const { isAuthorized, error, status } = await adminAuthCheck(request);

    if(!isAuthorized) return NextResponse.json({ message: error },{ status });

  try {
    const packageUnits = await prisma.packageUnit.findMany({
      where: {
        publishStatus: "PUBLISHED",
      },
      select: {
        id: true,
        name: true,
        gs1SalesCode: true, 
        unifiedCode: true,
        currentShippingStatus: true,
        Drug: {
          select: {
            id: true,
            name: true,
            yjCode: true,
            productType: true,
            GenericName: true,
            SalesCompany: true,
          },
        },
      }, 
      orderBy: {
        id: "asc", 
      },
    })

    return NextResponse.json<GetPublishedPackageUnitsResponse>({ packageUnits }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}



/** 医薬品情報の新規登録 */
export const POST = async (request: NextRequest) => {
  //admin権限の確認
  const { isAuthorized, error, status } = await adminAuthCheck(request);

  if(!isAuthorized) return NextResponse.json({ message: error },{ status });
  
  try {
    // リクエストのbodyを取得
    const body: CreateDrugRequest = await request.json();

    // bodyの中から医薬品情報を取り出す
    const {
      name,
      price,
      drugPriceListingCode,
      yjCode,
      isSelectMedical,
      isAuthorizedGeneric,
      packageInsertUrl,
      productType,
      genericNameId,
      unitId,
      manufacturingCompanyId,
      salesCompanyId,

      //-- PackageUnits 各包装情報 --
      packageUnits,
    } = body

    
    // 投稿をDBに生成
    //製品と包装毎の情報を一括作成
    const newDrug = await prisma.drug.create({
      data: {
        // 製品情報
        name,
        price,
        drugPriceListingCode,
        yjCode,
        isSelectMedical,
        isAuthorizedGeneric,
        packageInsertUrl,
        productType,
        genericNameId,
        unitId,
        manufacturingCompanyId,
        salesCompanyId,

        // 製品の各包装情報
        PackageUnits: { 
          create: packageUnits.map((pkg) => ({
            name: pkg.name,
            gs1SalesCode: pkg.gs1SalesCode || null,
            gs1DispensingCode: pkg.gs1DispensingCode || null,
            hotCode: pkg.hotCode || null,
            janCode: pkg.janCode || null,
            unifiedCode: pkg.unifiedCode,
            currentShippingStatus: pkg.currentShippingStatus,
            publishStatus: pkg.publishStatus,
          })),
        },
      },
    });

    // 成功レスポンス
    return NextResponse.json<CreateDrugResponse>(
      { 
        message: `${newDrug.name}を登録しました`,
        data: {id: newDrug.id}
      }, 
      { status: 201 }
    );

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

