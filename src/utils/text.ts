/**
 * 全角の英数字・記号・空白を半角にする
 * 医薬品名やコードはDBに半角で登録しているため、入力の表記ゆれ対策
 * （かな・漢字・カタカナはそのまま）
 */
export const toHalfWidth = (value: string): string =>
  value
    .replace(/[！-～]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/　/g, " ")

/** ひらがな → カタカナ（U+3041-U+3096） */
export const toKatakana = (value: string): string =>
  value.replace(/[ぁ-ゖ]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 0x60))

/** カタカナ → ひらがな（U+30A1-U+30F6） */
export const toHiragana = (value: string): string =>
  value.replace(/[ァ-ヶ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60))
