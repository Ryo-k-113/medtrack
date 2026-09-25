/**
 * 販売会社名の略称(モバイル幅などの狭い場所で利用)
 * 1. COMPANY_SHORT_NAMES に個別の略称があれば使用
 * 2. KEEP_FULL_NAMES に含まれていれば正式名称を維持
 * 3. 上記以外は、末尾の「製薬」「工業」「ファーマ」などを省く（「薬品工業」のように重なる場合は両方省く）
 *
 * 会社を追加・変更したときは、略称が別の会社と同じにならないか確認
 */

/** 末尾から省く語 */
const STRIPPED_SUFFIXES = ["製薬", "工業", "ファーマ", "ファルマ", "薬品", "産業", "工場"]

/** 個別の略称（省く語のルールだけでは長すぎる会社） */
const COMPANY_SHORT_NAMES: Record<string, string> = {
  "NISSHAゾンネボード製薬": "NISSHAゾンネボード",
  "Swedish Orphan Biovitrum Japan": "Sobi",
  "アミカス・セラピューティクス": "アミカス",
  "アルジェニクスジャパン": "アルジェニクス",
  "エイエムオー・ジャパン": "エイエムオー",
  "エッセンシャルファーマ": "エッセンシャル",
  "オリオンファーマ・ジャパン": "オリオン",
  "キエジ・ファーマ・ジャパン": "キエジ",
  "ギリアド・サイエンシズ": "ギリアド",
  "ジェンザイム・ジャパン": "ジェンザイム",
  "スミス・アンド・ネフュー": "スミス&ネフュー",
  "セルトリオン・ヘルスケア・ジャパン": "セルトリオン",
  "ノボノルディスクファーマ": "ノボノルディスク",
  "バイオジェン・ジャパン": "バイオジェン",
  "バイオベラティブ・ジャパン": "バイオベラティブ",
  "ビーブランド・メディコ−デンタル": "ビーブランド",
  "ビーワン・メディシンズ": "ビーワン",
  "ファーマエッセンシアジャパン": "ファーマエッセンシア",
  "フレゼニウスカービジャパン": "フレゼニウス",
  "リジェネロン・ジャパン": "リジェネロン",
  "陽進堂ホールディングス": "陽進堂",
}

/**
 * 略さない会社
 * - 略すと別の会社と同じ名前になる（東和薬品と東和製薬など）
 * - 略すと意味が変わる・短すぎる（光製薬 →「光」、第一薬品産業 →「第一」 など）
 */
const KEEP_FULL_NAMES = new Set([
  // 別の会社と同じ略称になる
  "サンドファーマ",
  "ニプロファーマ",
  "メルスモン製薬",
  "ロートニッテンファーマ",
  "日医工ファーマ",
  "全星薬品",
  "全星薬品工業",
  "大塚製薬",
  "大塚製薬工場",
  "富士薬品",
  "富士製薬工業",
  "東和薬品",
  "東和製薬",
  "武田テバファーマ",
  "武田テバ薬品",
  "科研ファルマ",
  "科研製薬",
  // 略すと意味が変わる・短すぎる
  "光製薬",
  "日本製薬",
  "EAファーマ",
  "Meファルマ",
  "サンファーマ",
  "救急薬品工業",
  "第一薬品産業",
  "明治薬品",
])

/** 末尾の区切り記号（「・」や空白）を落とす */
const trimSeparators = (value: string): string => value.replace(/[\s・−-]+$/, "")

/**
 * モバイルで表示する会社名を返す
 * @param name - 販売会社の正式な名前
 * @returns 略称（略さない場合は正式な名前のまま）
 */
export const toShortCompanyName = (name: string): string => {
  const override = COMPANY_SHORT_NAMES[name]
  if (override) return override
  if (KEEP_FULL_NAMES.has(name)) return name

  // 「大原薬品工業」→「大原薬品」→「大原」のように、末尾の語がなくなるまで省く
  let shortName = trimSeparators(name)
  for (;;) {
    const suffix = STRIPPED_SUFFIXES.find(
      (word) => shortName.endsWith(word) && shortName.length > word.length
    )
    if (!suffix) return shortName
    shortName = trimSeparators(shortName.slice(0, -suffix.length))
  }
}
