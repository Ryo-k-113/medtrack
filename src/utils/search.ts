import { toHalfWidth, toHiragana, toKatakana } from "@/utils/text"

/**
 * コードとしても検索する単語の形
 * 「60」「1000」のような規格の数字が、長いコードの一部に一致して
 * 関係ない医薬品が混ざらないよう、5文字以上の英数字に限る
 */
const CODE_KEYWORD_PATTERN = /^[0-9A-Za-z]{5,}$/

/**
 * 複数検索の区切りとして受け付ける文字（半角カンマ・全角カンマ・読点）
 * 「・」は成分名に含まれ、空白は絞り込みの区切りに使うため対象外
 */
const MULTI_KEYWORD_SEPARATOR = /[,，、]/

/**
 * 複数検索のキーワードに分ける
 * 日本語入力のままでも区切れるよう、「,」に加えて「，」「、」でも分ける
 * （例：「アムロジピン、ロスバスタチン」→ ["アムロジピン", "ロスバスタチン"]）
 */
export const splitMultiKeywords = (query: string | null | undefined): string[] =>
  (query ?? "")
    .split(MULTI_KEYWORD_SEPARATOR)
    .map((keyword) => keyword.trim())
    .filter(Boolean)

/**
 * 検索キーワードを単語に分ける
 * 全角スペースで区切られていても分けられるよう、半角に揃えてから分割する
 * （例：「ロキソ　６０　サワイ」→ ["ロキソ", "60", "サワイ"]）
 */
export const splitSearchKeywords = (search: string | null | undefined): string[] =>
  toHalfWidth(search ?? "").trim().split(/\s+/).filter(Boolean)

/**
 * 医薬品の検索に使う単語の表記（入力そのまま・カタカナ・ひらがな）
 * ひらがなで入力しても、カタカナの医薬品名に一致させるため
 * （例：「ろきそ」→ ["ろきそ", "ロキソ"]）
 */
export const getNameKeywordVariants = (keyword: string): string[] =>
  Array.from(new Set([keyword, toKatakana(keyword), toHiragana(keyword)]))

/** 単語をコードとしても検索するか */
export const isCodeKeyword = (keyword: string): boolean => CODE_KEYWORD_PATTERN.test(keyword)
