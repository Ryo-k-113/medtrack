import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"
import type { SearchDrugsResponse } from "@/types/search"


/** 医薬品の検索（公開・offsetページネーション） */
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)

    // 検索キーワード
    const keyword = searchParams.get("keyword")?.trim() ?? ""

    // キーワードが空の場合は空の結果を返す
    if (!keyword) {
      return NextResponse.json<SearchDrugsResponse>(
        { drugs: [], totalCount: 0 },
        { status: 200 }
      )
    }

    // 現在のページ番号
    const page = Math.max(1, Number(searchParams.get("page")) || 1)

    // 1ページの表示件数
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10))

    // 公開中の包装が1つ以上あり、医薬品名または成分名にキーワードを含む医薬品を検索
    const where: Prisma.DrugWhereInput = {
      PackageUnits: {
        some: { publishStatus: "PUBLISHED" },
      },
      OR: [
        { name: { contains: keyword, mode: "insensitive" } },
        { GenericName: { name: { contains: keyword, mode: "insensitive" } } },
      ],
    }

    const [drugs, totalCount] = await Promise.all([
      prisma.drug.findMany({
        where,
        select: {
          id: true,
          name: true,
          yjCode: true,
          productType: true,
          price: true,
          packageInsertUrl: true,
          Unit: { select: { id: true, name: true } },
          GenericName: { select: { id: true, name: true } },
          SalesCompany: { select: { id: true, name: true } },
          PackageUnits: {
            where: { publishStatus: "PUBLISHED" },
            select: { id: true, name: true, currentShippingStatus: true },
            orderBy: { id: "asc" },
          },
        },
        orderBy: { id: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.drug.count({ where }),
    ])

    // レスポンスデータの変換（Decimal型をnumberへ変換）
    const responseDrugs = drugs.map((drug) => ({
      ...drug,
      price: drug.price ? Number(drug.price) : null,
    }))

    return NextResponse.json<SearchDrugsResponse>(
      { drugs: responseDrugs, totalCount },
      { status: 200 }
    )

  } catch {
    return NextResponse.json({ message: "エラーが発生しました"}, { status: 400 })
  }
}
