import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ProductType, type Prisma } from "@prisma/client"
import { buildDrugSearchCondition } from "@/app/api/_lib/buildDrugSearchCondition"
import type { SearchDrugsResponse } from "@/types/search"


/** 絞り込みで受け付ける製品区分 */
const PRODUCT_TYPES: string[] = Object.values(ProductType)

/** カンマ区切りの製品区分を読み取る */
const parseProductTypes = (value: string | null): ProductType[] =>
  (value ?? "")
    .split(",")
    .filter((type): type is ProductType => PRODUCT_TYPES.includes(type))


/** 医薬品の検索（公開・offsetページネーション） */
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)

    // 検索キーワード（空白で区切った単語をすべて含む医薬品を探す）
    const keywordCondition = buildDrugSearchCondition(searchParams.get("keyword"))

    // キーワードが空の場合は空の結果を返す
    if (!keywordCondition) {
      return NextResponse.json<SearchDrugsResponse>(
        { drugs: [], totalCount: 0 },
        { status: 200 }
      )
    }

    // 現在のページ番号
    const page = Math.max(1, Number(searchParams.get("page")) || 1)

    // 1ページの表示件数
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10))

    // 製品区分の絞り込み（指定がなければ絞り込まない）
    const productTypes = parseProductTypes(searchParams.get("productTypes"))

    // 公開中の包装が1つ以上あり、キーワードに一致する医薬品を検索
    const where: Prisma.DrugWhereInput = {
      PackageUnits: {
        some: { publishStatus: "PUBLISHED" },
      },
      ...keywordCondition,
      ...(productTypes.length > 0 && { productType: { in: productTypes } }),
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
