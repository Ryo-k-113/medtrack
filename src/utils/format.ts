
/**
 * ISO形式の日付文字列を「YYYY/MM/DD」形式に変換する
 * @param dateString - 日付文字列
 * @returns フォーマットされた文字列、データがない・不正な場合は null
 */

export const formatDate = (dateString: string | null | undefined): string | null => {

  if (!dateString) return null;

  const date = new Date(dateString);

  // 不正な文字なら null を返す
  if (isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};