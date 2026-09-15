/**
 * 全角の英数字・記号・空白を半角にする
 * 医薬品名やコードはDBに半角で登録しているため、入力の表記ゆれを揃えるのに使う
 * （かな・漢字・カタカナはそのまま）
 */
export const toHalfWidth = (value: string): string =>
  value
    .replace(/[！-～]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/　/g, " ")
