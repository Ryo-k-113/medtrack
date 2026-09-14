import { format, isValid } from "date-fns";
import { tz } from "@date-fns/tz";
import { APP_TIME_ZONE } from "@/utils/date";

/**
 * ISO形式の日付文字列を「YYYY/MM/DD」形式に変換する
 * 実行環境のタイムゾーンに依存しないよう、日本時間で表示する
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

  return format(date, "yyyy/MM/dd", { in: tz(APP_TIME_ZONE) });
};

/**
 * ISO形式の日付文字列を「YYYY/MM/DD HH:mm」形式に変換する
 * 実行環境のタイムゾーンに依存しないよう、日本時間で表示する
 * @param dateString - 日付文字列
 * @returns フォーマットされた文字列、データがない・不正な場合は null
 */
export const formatDateTime = (dateString: string | null | undefined): string | null => {

  if (!dateString) return null;

  const date = new Date(dateString);

  if (!isValid(date)) {
    return null;
  }

  return format(date, "yyyy/MM/dd HH:mm", { in: tz(APP_TIME_ZONE) });
};
