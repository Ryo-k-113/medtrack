import type { Prisma } from "@prisma/client"
import { getNameKeywordVariants, isCodeKeyword, splitSearchKeywords } from "@/utils/search"

/**
 * 1つの単語について、医薬品名・成分名・コードのいずれかに部分一致する条件
 */
const buildKeywordCondition = (keyword: string): Prisma.DrugWhereInput => {
  // ひらがな・カタカナのどちらで入力しても一致するよう、表記ごとに条件
  const nameConditions = getNameKeywordVariants(keyword).flatMap(
    (variant): Prisma.DrugWhereInput[] => {
      const contains = { contains: variant, mode: "insensitive" } as const
      return [
        { name: contains },
        { GenericName: { name: contains } },
      ]
    }
  )

  if (!isCodeKeyword(keyword)) return { OR: nameConditions }

  const contains = { contains: keyword, mode: "insensitive" } as const

  return {
    OR: [
      ...nameConditions,

      // 医薬品のコード
      { yjCode: contains },
      { drugPriceListingCode: contains },

      // 公開中の包装のコード
      {
        PackageUnits: {
          some: {
            publishStatus: "PUBLISHED",
            OR: [
              { gs1SalesCode: contains },
              { gs1DispensingCode: contains },
              { hotCode: contains },
              { unifiedCode: contains },
            ],
          },
        },
      },
    ],
  }
}

/**
 * ユーザー向けの医薬品検索の条件を組み立てる
 * 空白で区切った単語がすべて、医薬品名・成分名・各コードのどこかに含まれる医薬品に絞る
 * （例：「ろきそ 60 さわい」→ ロキソプロフェン錠60mg「サワイ」）
 * @param search - 検索キーワード（全角・ひらがなで入力されても検索できる）
 * @returns 医薬品のwhere条件（キーワードが空の場合は null）
 */
export const buildDrugSearchCondition = (
  search: string | null | undefined
): Prisma.DrugWhereInput | null => {
  const keywords = splitSearchKeywords(search)
  if (keywords.length === 0) return null

  return { AND: keywords.map(buildKeywordCondition) }
}
