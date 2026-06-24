import { format, isValid } from "date-fns";

/**
 * ISO形式の日付文字列を「YYYY/MM/DD」形式に変換する
 * @param dateString - 日付文字列
 * @returns フォーマットされた文字列、データがない・不正な場合は null
 */

export const formatDate = (dateString: string | null | undefined): string | null => {

  if (!dateString) return null;

  const date = new Date(dateString);

  // 不正な文字列はnullを
  if (!isValid(date)) {
    return null;
  }
  
  return format(date, "yyyy/MM/dd");
};