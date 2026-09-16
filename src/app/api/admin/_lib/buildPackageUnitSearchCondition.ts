import type { Prisma } from "@prisma/client"
import { getNameKeywordVariants, isCodeKeyword, splitSearchKeywords } from "@/utils/search"

/**
 * 1つの単語について、医薬品名・成分名・コードのいずれかに部分一致する条件
 */
const buildKeywordCondition = (keyword: string): Prisma.PackageUnitWhereInput => {
  // ひらがな・カタカナのどちらで入力しても一致するよう、表記ごとに条件を作る
  const nameConditions = getNameKeywordVariants(keyword).flatMap(
    (variant): Prisma.PackageUnitWhereInput[] => {
      const contains = { contains: variant, mode: "insensitive" } as const
      return [
        { Drug: { name: contains } },
        { Drug: { GenericName: { name: contains } } },
      ]
    }
  )

  if (!isCodeKeyword(keyword)) return { OR: nameConditions }

  const contains = { contains: keyword, mode: "insensitive" } as const

  return {
    OR: [
      ...nameConditions,

      // 医薬品のコード
      { Drug: { yjCode: contains } },
      { Drug: { drugPriceListingCode: contains } },

      // 包装のコード
      { gs1SalesCode: contains },
      { gs1DispensingCode: contains },
      { hotCode: contains },
      { unifiedCode: contains },
    ],
  }
}

/**
 * 管理画面の医薬品(包装)一覧の検索条件を組み立てる
 * 空白で区切った単語がすべて、医薬品名・成分名・各コードのどこかに含まれるものに絞る
 * （例：「ロキソ 60 サワイ」→ ロキソプロフェン錠60mg「サワイ」）
 * @param search - 検索キーワード（全角で入力されても半角に揃えて検索する）
 * @returns 包装のwhere条件（キーワードが空の場合は条件なし）
 */
export const buildPackageUnitSearchCondition = (
  search: string | null | undefined
): Prisma.PackageUnitWhereInput => {
  const keywords = splitSearchKeywords(search)
  if (keywords.length === 0) return {}

  return { AND: keywords.map(buildKeywordCondition) }
}
