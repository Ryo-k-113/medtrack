/**
 * 添付文書へのリンク
 * PMDAの医療用医薬品の検索にYJコードを渡す
 * （1品目なら添付文書関連のページへ直接、併売品など複数あれば品目の選択画面へ）
 */

/** YJコードの形式（半角英数の12桁） */
const YJ_CODE_PATTERN = /^[0-9A-Z]{12}$/

/**
 * PMDAの添付文書のページのURL作成
 * @param yjCode - YJコード（個別医薬品コード）
 * @returns URL。YJコードの形式が正しくない場合は null
 */
export const buildPackageInsertUrl = (yjCode: string): string | null => {
  if (!YJ_CODE_PATTERN.test(yjCode)) return null
  return `https://www.pmda.go.jp/PmdaSearch/rdSearch/02/${yjCode}?user=1`
}
