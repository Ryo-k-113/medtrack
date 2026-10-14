import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { DosageForm, ProductType, type Prisma } from "@prisma/client"
import { buildDrugSearchCondition } from "@/app/api/_lib/buildDrugSearchCondition"
import type { SearchDrugsResponse } from "@/types/search"


/**
 * カンマ区切りの値を、受け付ける値（enum の値）だけに絞って読み取る
 * @param value - クエリの値（例："TABLET,CAPSULE"）
 * @param allowed - 受け付ける値の一覧
 */
const parseEnumList = <T extends string>(value: string | null, allowed: readonly T[]): T[] =>
  (value ?? "")
    .split(",")
    .filter((item): item is T => (allowed as readonly string[]).includes(item))


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

    // 製品区分・剤形の絞り込み（指定がなければ絞り込まない）
    const productTypes = parseEnumList(searchParams.get("productTypes"), Object.values(ProductType))
    const dosageForms = parseEnumList(searchParams.get("dosageForms"), Object.values(DosageForm))

    // 公開中の包装が1つ以上あり、キーワードに一致する医薬品を検索
    const where: Prisma.DrugWhereInput = {
      PackageUnits: {
        some: { publishStatus: "PUBLISHED" },
      },
      ...keywordCondition,
      ...(productTypes.length > 0 && { productType: { in: productTypes } }),
      ...(dosageForms.length > 0 && { dosageForm: { in: dosageForms } }),
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
          Unit: { select: { id: true, name: true } },
          GenericName: { select: { id: true, name: true } },
          SalesCompany: { select: { id: true, name: true } },
          PackageUnits: {
            where: { publishStatus: "PUBLISHED" },
            select: {
              id: true,
              name: true,
              breakdown: true,
              variant: true,
              currentShippingStatus: true,
            },
            orderBy: { id: "asc" },
          },
        },
        // 規格 → 剤形 → 医薬品名の順に並べる（同じ規格の製品をまとめて表示する）
        orderBy: [
          { Unit: { name: "asc" } },
          { dosageForm: "asc" },
          { name: "asc" },
          { id: "asc" },
        ],
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
