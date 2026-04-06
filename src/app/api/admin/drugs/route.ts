import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminAuthCheck } from "@/app/api/admin/_lib/adminAuthCheck";
import type { CreateDrugRequest } from '@/types/admin/drug';

//公開済みの医薬品情報一覧を取得
//製品名、一般名、製品区分、包装単位、YJコード、GS1コード、最新出荷ステータス、販売会社
export const GET = async () => {
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
            GenericName: {
              select: { 
                id: true,
                name: true, 
              },
            },
            SalesCompany: {
              select: { 
                id: true,
                name: true,
              },
            },
          },
        },
      }, 
    })

    return NextResponse.json({ packageUnits }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}



//医薬品情報の新規登録
export const POST = async (request: NextRequest) => {
  //admin権限の確認
  const { isAuthorized, error, status } = await adminAuthCheck(request);

  if(!isAuthorized) return NextResponse.json({ error },{ status });
  
  try {
    // リクエストのbodyを取得
    const body: CreateDrugRequest = await request.json();

    // bodyの中から医薬品情報を取り出す
    //-- Drug: 製品共通情報 --
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

        GenericNameId,
        UnitId,
        ManufacturingCompanyId,
        SalesCompanyId,

        // 製品の各包装情報
        PackageUnits: { 
          create: packageUnits.map((pkg) => ({
            name: pkg.name,
            gs1SalesCode: pkg.gs1SalesCode || null,
            gs1DispensingCode: pkg.gs1DispensingCode || null,
            hotCode: pkg.hotCode || null,
            janCode: pkg.janCode || null,
            unifiedCode: pkg.unifiedCode || null,
            //Enumのステータス
            currentShippingStatus: pkg.currentShippingStatus,
            publishStatus: pkg.publishStatus,
            
            // 日付データのDate型変換
            salesTransferDate: pkg.salesTransferDate || null,
            discontinuedDate: pkg.discontinuedDate|| null,
            transitionalMeasuresDate: pkg.transitionalMeasuresDate || null,
          })),
        },
      },
      include: { PackageUnits: true }, // 登録結果に子データも含めて返す
    });

    
    return NextResponse.json(
      { 
        message: "登録が完了しました",
        data: newDrug
      }, 
      { status: 201 }
    );

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    console.error("【APIエラー発生】:", error);
  }
}

