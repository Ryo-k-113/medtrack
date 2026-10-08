import { format, isValid } from "date-fns";
import { tz } from "@date-fns/tz";
import { APP_TIME_ZONE } from "@/utils/date";
import type { AnnounceType } from "@prisma/client";

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


/**
 * 日付を指定の書式で表示する（日本時間）
 * @returns フォーマットされた文字列、データがない・不正な場合は null
 */
const formatWith = (dateString: string | null | undefined, pattern: string): string | null => {
  if (!dateString) return null;

  const date = new Date(dateString);

  if (!isValid(date)) {
    return null;
  }

  return format(date, pattern, { in: tz(APP_TIME_ZONE) });
};

type EffectiveDateOptions = {
  announceType: AnnounceType | null
  announcedDate: string | null
  isAfterStockDepletion: boolean
}

/**
 * 利用者向けの告知の適用日の表示
 * - 在庫消尽後の告知：目安の日付があれば「⚪︎⚪︎年⚪︎⚪︎月頃」、
 * - 販売移管：「2026年12月1日〜」
 * - それ以外：「2026/12/01」
 * @param effectiveDate - 適用日
 * @returns フォーマットされた文字列、データがない・不正な場合は null
 */
export const formatEffectiveDate = (
  effectiveDate: string | null | undefined,
  { announceType, announcedDate, isAfterStockDepletion }: EffectiveDateOptions
): string | null => {
  if (isAfterStockDepletion) {
    // 時期の目安が無い告知は、適用日を告知日と同じ日にする運用
    const hasNoEstimate = formatDate(effectiveDate) === formatDate(announcedDate);
    return hasNoEstimate ? "在庫消尽次第" : formatWith(effectiveDate, "yyyy年M月頃");
  }
  if (announceType === "TRANSFER_OF_SALE") return formatWith(effectiveDate, "yyyy年M月d日〜");

  return formatDate(effectiveDate);
};

type ScheduleDateOptions = {
  announcedDate: string | null
  isAfterStockDepletion: boolean
}

/**
 * 予定のタグ（販売移管・販売中止など）に出す時期の表示
 * - 在庫消尽後の告知：「在庫消尽後・2026年12月頃」
 * - それ以外：「2026年12月1日〜」
 * @param effectiveDate - 適用日
 * @returns フォーマットされた文字列、データがない・不正な場合は null
 */
export const formatScheduleDate = (
  effectiveDate: string | null | undefined,
  { announcedDate, isAfterStockDepletion }: ScheduleDateOptions
): string | null => {
  if (isAfterStockDepletion) {
    // 時期の目安が無い告知は、適用日を告知日と同じ日にする運用
    const hasNoEstimate = formatDate(effectiveDate) === formatDate(announcedDate);
    if (hasNoEstimate) return "在庫消尽次第";

    const month = formatWith(effectiveDate, "yyyy年M月頃");
    return month ? `在庫消尽後・${month}` : null;
  }

  return formatWith(effectiveDate, "yyyy年M月d日〜");
};
