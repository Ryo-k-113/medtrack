import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminAuthCheck } from "@/app/api/admin/_lib/adminAuthCheck";


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

