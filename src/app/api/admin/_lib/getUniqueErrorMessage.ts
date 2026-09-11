import { Prisma } from "@prisma/client"

/**
 * 一意制約ごとの重複時のメッセージ
 * P2002 の meta.target にはDBのカラム名が入る（例: ["gs1_sales_code"]）
 */
const UNIQUE_ERROR_MESSAGES: { columns: string[]; message: string }[] = [
  { columns: ["yj_code", "sales_company_id"], message: "同じYJコードと販売会社の組み合わせが既に登録されています" },
  { columns: ["gs1_sales_code"], message: "同じ販売GS1コードの包装が既に登録されています" },
  { columns: ["gs1_dispensing_code"], message: "同じ調剤GS1コードの包装が既に登録されています" },
  { columns: ["hot_code"], message: "同じHOTコードの包装が既に登録されています" },
  { columns: ["unified_code"], message: "同じ統一商品コードの包装が既に登録されています" },
]

/** 重複したカラムが判定できない場合のメッセージ */
const DEFAULT_UNIQUE_ERROR_MESSAGE = "既に登録されている値と重複しています"

/**
 * 一意制約の違反（P2002）であれば、重複したカラムに応じたメッセージを返す
 * @param error - 捕捉したエラー
 * @returns 一意制約の違反ならメッセージ、それ以外は null
 */
export const getUniqueErrorMessage = (error: unknown): string | null => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
    return null
  }

  const target = error.meta?.target
  const columns = Array.isArray(target)
    ? target.filter((column): column is string => typeof column === "string")
    : []

  const matched = UNIQUE_ERROR_MESSAGES.find((rule) =>
    rule.columns.every((column) => columns.includes(column))
  )

  return matched?.message ?? DEFAULT_UNIQUE_ERROR_MESSAGE
}
