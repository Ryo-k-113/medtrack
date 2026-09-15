import type { Prisma } from "@prisma/client"
import { toHalfWidth } from "@/utils/text"

/**
 * コードとしても検索する単語の形
 * 「60」「1000」のような規格の数字が、長いコードの一部に一致して
 * 関係ない医薬品が混ざらないよう、5文字以上の英数字に限る
 */
const CODE_KEYWORD_PATTERN = /^[0-9A-Za-z]{5,}$/

/**
 * 1つの単語について、医薬品名・成分名・コードのいずれかに部分一致する条件
 */
const buildKeywordCondition = (keyword: string): Prisma.PackageUnitWhereInput => {
  const contains = { contains: keyword, mode: "insensitive" } as const

  const nameConditions: Prisma.PackageUnitWhereInput[] = [
    { Drug: { name: contains } },
    { Drug: { GenericName: { name: contains } } },
  ]

  if (!CODE_KEYWORD_PATTERN.test(keyword)) return { OR: nameConditions }

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
  // 全角スペースで区切られていても分けられるよう、半角に揃えてから分割する
  const keywords = toHalfWidth(search ?? "").trim().split(/\s+/).filter(Boolean)
  if (keywords.length === 0) return {}

  return { AND: keywords.map(buildKeywordCondition) }
}
