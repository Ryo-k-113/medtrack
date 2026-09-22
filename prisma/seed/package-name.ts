/**
 * GS1コード一覧表の項目から、包装名・内訳・注記を組み立てる
 *
 * 包装名   発注の単位。「PTP100錠」「100mL×10キット」「200mL」
 * 内訳     包装名だけでは分からない中身。「10錠×10」（錠・カプセル・枚のみ）
 * 注記     同じ医薬品内で包装名が重複したときの見分け。「広口開栓型」「刻」
 *
 * 個別の手直しは prisma/seed/package-overrides.json で上書きする
 */
import { readFileSync } from "node:fs"
import path from "node:path"

/** 個別の手直し（販売GS1コードごとに、包装名・内訳・注記を差し替える） */
type Override = {
  name?: string
  breakdown?: string | null
  variant?: string | null
  reason?: string
}

const OVERRIDE_FILE = path.join(process.cwd(), "prisma/seed/package-overrides.json")

const overrides: Record<string, Override> = JSON.parse(
  readFileSync(OVERRIDE_FILE, "utf-8")
).packages

/** 全角の英数記号を半角にする */
export const toHalfWidth = (value: string): string =>
  value
    .replace(/[！-～]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/　/g, " ")
    .trim()

/** 包装名に付けない包装形態（「注射剤1瓶」ではなく「1瓶」とする） */
const DROPPED_FORMS = ["注射剤", "包装小", "分包", "調剤用"]

/** 「包」を付ける包装形態（分包・SP・ヒートシールは1包ずつ分かれている） */
const SACHET_FORMS = ["分包", "SP", "HS"]

/** 数えられる単位。総数を包装名にし、1包装あたりの数を内訳にする */
const COUNT_UNITS = ["錠", "カプセル", "枚"]

/** 容器の単位。容量×本数の形にする */
const CONTAINER_UNITS = [
  "瓶", "管", "筒", "キット", "袋", "包", "個", "組", "本", "セット", "シート", "バイアル",
  "シリンジ", "カセット", "ブリスター", "球", "丸", "缶", "箱", "容器", "人分", "回分",
]

/** 包装形態を付けない容器の単位（「PTP1セット」ではなく「1セット」とする） */
const PREFIXLESS_UNITS = ["セット", "組", "回分", "人分", "箱", "容器"]

/** 容量の単位。mg・MBqなどは包装名に使わない */
const VOLUME_UNITS = ["mL", "L", "g", "kg"]

/** 「1患者当たり」の包装に使う容器（既定は袋。医薬品名で上書きする） */
const PATIENT_CONTAINERS: { pattern: RegExp; container: string }[] = [
  { pattern: /ゾルゲンスマ/, container: "バイアル" },
]
const DEFAULT_PATIENT_CONTAINER = "袋"

/** GS1の項目（必要なものだけ） */
export type Gs1PackageRow = {
  規格単位: string
  包装形態: string
  包装単位数: string
  包装単位数単位: string
  総数量数: string
  総数量数単位: string
  製品名: string
  製品名_包装名: string
}

export type PackageInfo = {
  name: string
  breakdown: string | null
  variant: string | null
  /** 旧規則（包装形態＋総数＋単位）で作った包装名。投入済みDBの上書き判定に使う */
  legacyName: string
}

/** 旧規則の包装名。投入済みのDBにこの名前のまま入っている包装だけを差し替える */
export const buildLegacyName = (row: Gs1PackageRow): string =>
  toHalfWidth(`${row.包装形態}${row.総数量数}${row.総数量数単位}`).replace(/\s+/g, "")

/** 「0.6ｇ」「10錠」を数値と単位に分ける */
const parseAmount = (value: string): { value: number | null; unit: string } => {
  const text = toHalfWidth(value).replace(/,/g, "")
  const match = /^([\d.]+)\s*(.*)$/.exec(text)
  if (!match) return { value: null, unit: text }
  const amount = Number(match[1])
  return { value: Number.isFinite(amount) ? amount : null, unit: match[2].trim() }
}

/** 小数の末尾の0を落とす（16.0 → 16） */
const trimZero = (value: number): string => String(Number(value.toFixed(3)))

/**
 * 容量を読みやすい単位にする
 * 1,000mL以上はLにする（16000mL → 16L）
 */
export const formatVolume = (value: number, unit: string): string => {
  // 1,003mLのような端数はmLのまま（1.003Lでは読みにくい）
  if (unit === "mL" && value >= 1000 && value % 100 === 0) return `${trimZero(value / 1000)}L`
  return `${trimZero(value)}${unit}`
}

/**
 * 規格単位から、容器1つあたりの容量を取り出す
 * 「２００ｍｇ１．２ｍＬ１キット」→ 1.2mL（成分量のmgは容量に使わない）
 * 容量が書かれていない「１０ｍｇ１瓶」などは null
 */
const readContainerVolume = (specUnit: string): { value: number; unit: string } | null => {
  const text = toHalfWidth(specUnit).replace(/[\s,]/g, "")
  // 容器の単位で終わっていない規格単位（「0.05%1mL」など）は容量を持たない
  if (!CONTAINER_UNITS.some((container) => new RegExp(`\\d*${container}`).test(text))) return null

  const matches = Array.from(text.matchAll(/([\d.]+)(mL|L|kg|g)(?![a-zA-Z])/g))
  const last = matches[matches.length - 1]
  if (!last) return null

  const value = Number(last[1])
  if (!Number.isFinite(value) || value <= 0) return null
  return { value, unit: last[2] }
}

/** 「1患者当たり」を数える容器に言い換える */
const patientContainer = (drugName: string): string =>
  PATIENT_CONTAINERS.find(({ pattern }) => pattern.test(drugName))?.container ??
  DEFAULT_PATIENT_CONTAINER

/**
 * GS1の「製品名_包装名」から注記を取り出す
 * 「製品名 包装形態 包装単位数 注記…」の形で並んでいるため、前の3つを取り除く
 */
const readRawVariant = (row: Gs1PackageRow): string => {
  const text = toHalfWidth(row.製品名_包装名)
  const productName = toHalfWidth(row.製品名)
  const rest = text.startsWith(productName) ? text.slice(productName.length) : text
  const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const form = toHalfWidth(row.包装形態)
  // 包装単位数は「1」と「患者当たり」のように数と単位に分かれて並ぶ
  const unitAmount = toHalfWidth(row.包装単位数)
  const unitLabel = toHalfWidth(row.包装単位数単位)

  return rest
    .replace(new RegExp(`^\\s*${escape(form)}`), "")
    .replace(new RegExp(`^\\s*${escape(unitAmount)}`), "")
    .replace(new RegExp(`^\\s*${escape(unitLabel)}`), "")
    .trim()
}

// ---------------------------------------------------------------- 注記の整理

/** 包装の切り替えを表す語。現行品の見分けには使わない */
const CHANGE_PATTERN =
  /変更|オーバーラベル|ダブルバーコード|バーコードシール|新旧|切替|移行|小型化|自社コード品/

/** 製造元・販売元の表記 */
const MAKER_PATTERN = /^製造[:：]|製造元|販売元|発売元/

/** 記号と数字だけの語（「(9)」「xx」など） */
const SYMBOL_PATTERN = /^[\d\s()（）.,\-ー―－_*xｘ×/／]+$/

/** 保存の条件。包装の見分けではなく取り扱いの情報なので注記にしない */
const STORAGE_PATTERN = /遮光|しゃ光|保存|使用期間|冷所|箇月/

/** 長い材質の言い換え */
const VARIANT_ALIASES: [RegExp, string][] = [
  [/アルミニウム・ポリエチレンラミネートフィルム袋/, "アルミ袋"],
  [/患者さん用パッケージ入りPTP/, "患者用パッケージ入"],
]

/** 比較用に記号を落とす */
const normalizeForCompare = (value: string): string =>
  toHalfWidth(value).replace(/[^0-9A-Za-zぁ-んァ-ヶ一-龥]/g, "")

/**
 * 注記を整える
 * 1. 語ごとに分け、切り替え・製造元・記号だけ・保存条件・包装名と重なる語を落とす
 * 2. 先頭に包装名と同じ容量が付いている場合は落とす（「500mLプラスチックボトル」→「プラスチックボトル」）
 * 3. 長い材質名を言い換える
 */
export const cleanVariant = (rawVariant: string, packageName: string): string | null => {
  const words = toHalfWidth(rawVariant).split(/[ 、,／/]+/).filter(Boolean)
  const compareName = normalizeForCompare(packageName)

  const kept = words.filter((word) => {
    if (CHANGE_PATTERN.test(word)) return false
    if (MAKER_PATTERN.test(word)) return false
    if (SYMBOL_PATTERN.test(word)) return false
    if (STORAGE_PATTERN.test(word)) return false
    const compareWord = normalizeForCompare(word)
    return compareWord !== "" && !compareName.includes(compareWord)
  })

  // 包装名の先頭にある容量（500mL×20瓶 の 500mL）が注記にも付いている場合は落とす
  const volume = /^([\d.]+)(mL|L|kg|g)/.exec(packageName)?.[0] ?? ""
  const variant = kept
    .map((word) => (volume && word.startsWith(volume) ? word.slice(volume.length) : word))
    .filter(Boolean)
    .join(" ")
    .trim()

  if (!variant) return null
  return VARIANT_ALIASES.reduce((text, [pattern, alias]) => text.replace(pattern, alias), variant)
}

// ---------------------------------------------------------------- 包装名

/**
 * 包装名と内訳を組み立てる
 * 数える単位（錠・カプセル・枚）は総数を名前にし、1包装あたりの数を内訳にする
 * 容器の単位（瓶・キットなど）は「容量×本数容器」にする
 * 容量の単位（mL・g など）は「1包装の量×包装数」にする
 */
const buildName = (row: Gs1PackageRow): { name: string; breakdown: string | null } => {
  const form = toHalfWidth(row.包装形態)
  const totalUnitRaw = toHalfWidth(row.総数量数単位)
  const prefix =
    DROPPED_FORMS.includes(form) || PREFIXLESS_UNITS.includes(totalUnitRaw) ? "" : form
  const total = parseAmount(`${row.総数量数}${row.総数量数単位}`)
  const unit = parseAmount(`${row.包装単位数}${row.包装単位数単位}`)
  const totalUnit = toHalfWidth(row.総数量数単位)

  // 「1患者当たり」は数えられる容器に言い換える
  if (totalUnit === "患者当たり") {
    return { name: `1${patientContainer(toHalfWidth(row.製品名))}`, breakdown: null }
  }

  if (total.value === null) return { name: `${prefix}${toHalfWidth(row.総数量数)}${totalUnit}`, breakdown: null }

  // 錠・カプセル・枚
  if (COUNT_UNITS.includes(totalUnit)) {
    const name = `${prefix}${trimZero(total.value)}${totalUnit}`
    // 総数と1包装あたりの数が違うときだけ内訳を付ける
    // 枚は1枚ずつの個包装が多く、「1枚×10」では情報にならないため2枚以上に限る
    const minUnit = totalUnit === "枚" ? 2 : 1
    const hasBreakdown =
      unit.value !== null &&
      unit.value >= minUnit &&
      unit.value < total.value &&
      total.value % unit.value === 0
    const breakdown = hasBreakdown
      ? `${trimZero(unit.value as number)}${totalUnit}×${trimZero(total.value / (unit.value as number))}`
      : null
    return { name, breakdown }
  }

  // 瓶・管・筒・キットなど
  if (CONTAINER_UNITS.includes(totalUnit)) {
    const volume = readContainerVolume(row.規格単位)
    const count = `${trimZero(total.value)}${totalUnit}`
    if (!volume) return { name: `${prefix}${count}`, breakdown: null }
    return { name: `${prefix}${formatVolume(volume.value, volume.unit)}×${count}`, breakdown: null }
  }

  // mL・g など量で数えるもの
  if (VOLUME_UNITS.includes(totalUnit) && unit.value !== null && unit.value > 0) {
    const count = total.value / unit.value
    const each = formatVolume(unit.value, totalUnit)
    // 分包・ヒートシールは1包ずつ分かれているため「包」を付ける
    if (SACHET_FORMS.includes(form) && Number.isInteger(count) && count > 1) {
      return { name: `${prefix}${each}×${trimZero(count)}包`, breakdown: null }
    }
    if (Number.isInteger(count) && count > 1) {
      return { name: `${prefix}${each}×${trimZero(count)}`, breakdown: null }
    }
    return { name: `${prefix}${formatVolume(total.value, totalUnit)}`, breakdown: null }
  }

  return { name: `${prefix}${formatVolume(total.value, totalUnit)}`, breakdown: null }
}

/**
 * 包装名・内訳・注記を組み立てる
 * @param gs1SalesCode - 販売包装単位コード（個別の手直しを引くために使う）
 */
export const buildPackageInfo = (row: Gs1PackageRow, gs1SalesCode: string): PackageInfo => {
  const { name, breakdown } = buildName(row)
  const info: PackageInfo = {
    name,
    breakdown,
    variant: cleanVariant(readRawVariant(row), name),
    legacyName: buildLegacyName(row),
  }

  // GS1の項目からは作れないものは、手直しの指定で差し替える
  const override = overrides[gs1SalesCode]
  if (!override) return info
  return {
    ...info,
    name: override.name ?? info.name,
    breakdown: override.breakdown !== undefined ? override.breakdown : info.breakdown,
    variant: override.variant !== undefined ? override.variant : info.variant,
  }
}

/** 手直しの指定のうち、元データに無い販売GS1コード（指定の取り残しを見つける） */
export const unusedOverrides = (usedCodes: Set<string>): string[] =>
  Object.keys(overrides).filter((code) => !usedCodes.has(code))
