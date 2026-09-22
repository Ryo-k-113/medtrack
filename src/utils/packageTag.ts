/**
 * 検索結果のタグに出す包装名の組み立て
 * 同じ医薬品の中で包装名が重複したときだけ、注記を付けて見分けられるように
 */

/** タグでは省く容器の材質。省くと何も残らない場合は省かない */
const OMITTED_IN_TAG = [
  "ポリエチレンボトル",
  "ポリエチレンアンプル",
  "プラスチックボトル",
  "プラスチックシリンジ",
]

/** 注記をタグ用に短くする（「プラスチックボトル(広口開栓型)」→「広口開栓型」） */
export const toTagVariant = (variant: string): string => {
  const shortened = OMITTED_IN_TAG.reduce((text, word) => text.replaceAll(word, ""), variant)
    // 材質を省いた跡に残る記号を落とす
    .replace(/[（(]\s*[)）]/g, "")
    .replace(/^[\s・､、,／/]+|[\s・､、,／/]+$/g, "")
    .trim()

  // 材質だけの注記（「ポリエチレンボトル」など）は短くできないため元のまま出す
  if (!shortened) return variant
  // 括弧の対応が崩れた場合（「(広口開栓型)」の片方だけ残るなど）は括弧を外す
  const balanced = shortened.replace(/[（(]([^（()）]*)[)）]/g, "$1")
  return balanced.replace(/[（()）]/g, "").trim() || variant
}

/**
 * 同じ医薬品の中で重複している包装名を集める
 * @param packageUnits - 同じ医薬品の包装（表示する分だけでよい）
 */
export const findDuplicatedNames = (packageUnits: { name: string }[]): Set<string> => {
  const counts = new Map<string, number>()
  packageUnits.forEach(({ name }) => counts.set(name, (counts.get(name) ?? 0) + 1))
  return new Set(
    Array.from(counts)
      .filter(([, count]) => count > 1)
      .map(([name]) => name)
  )
}

/** タグに出す文字列（重複している包装だけ注記を付ける） */
export const buildTagLabel = (
  packageUnit: { name: string; variant: string | null },
  duplicatedNames: Set<string>
): string => {
  if (!packageUnit.variant || !duplicatedNames.has(packageUnit.name)) return packageUnit.name
  return `${packageUnit.name}（${toTagVariant(packageUnit.variant)}）`
}
