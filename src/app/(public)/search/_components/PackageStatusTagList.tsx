"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { CurrentShippingStatus } from "@prisma/client"
import { cn } from "@/lib/utils"
import { PackageStatusTag } from "./PackageStatusTag"
import type { SearchDrugResult } from "@/types/search"

type PackageUnit = SearchDrugResult["PackageUnits"][number]

type PackageStatusTagListProps = {
  drugId: number
  packageUnits: PackageUnit[]
}

/**
 * 出荷状況の並び順（出荷状況ガイドと同じ順）
 * enumの定義順に依存しないよう、明示的に持つ
 */
const STATUS_ORDER: Record<CurrentShippingStatus, number> = {
  NORMAL_SHIPMENT: 0,
  LIMITED_SHIPMENT: 1,
  SHIPMENT_SUSPENDED: 2,
  DISCONTINUED_SALE: 3,
}

/** 畳んだ包装の内訳に出す状況の略称（並び順と同じ順で表示する） */
const SUMMARY_LABEL: Record<CurrentShippingStatus, string> = {
  NORMAL_SHIPMENT: "通常",
  LIMITED_SHIPMENT: "限定",
  SHIPMENT_SUSPENDED: "停止",
  DISCONTINUED_SALE: "中止",
}

/**
 * 最初に表示する件数
 */
const INITIAL_VISIBLE_COUNT = {
  mobile: 4, // md未満（約2行分）
  tablet: 8, // md以上lg未満（約2行分）
} as const

/**
 * 畳んでいる間に隠すクラス
 * 画面幅ごとの件数を超えた包装だけを、その画面幅で隠す
 */
const getCollapsedClass = (index: number) => {
  if (index < INITIAL_VISIBLE_COUNT.mobile) return ""
  // モバイルのみ隠す
  if (index < INITIAL_VISIBLE_COUNT.tablet) return "hidden md:inline-flex"
  // モバイル・タブレットで隠す
  return "hidden lg:inline-flex"
}

/** 開閉ボタンの共通スタイル */
const TOGGLE_CLASS =
  "inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-dashed px-2 py-1 text-xs font-semibold text-weak transition-colors hover:bg-surface"

/**
 * 隠れている包装の件数を、出荷状況ごとに並べた文字列
 * @example "通常4・限定2・停止1"
 */
const summarizeHidden = (packageUnits: PackageUnit[]) =>
  Object.entries(SUMMARY_LABEL)
    .map(([status, label]) => {
      const count = packageUnits.filter((pkg) => pkg.currentShippingStatus === status).length
      return count > 0 ? `${label}${count}` : null
    })
    .filter(Boolean)
    .join("・")

// 包装単位ごとの出荷状況タグ（画面幅により初期表示を絞り、残りは開閉する）
export const PackageStatusTagList = ({ drugId, packageUnits }: PackageStatusTagListProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // 同じ状況の中では元の並び（登録順）を保つ
  const sortedUnits = [...packageUnits].sort(
    (a, b) => STATUS_ORDER[a.currentShippingStatus] - STATUS_ORDER[b.currentShippingStatus]
  )

  // 隠れる件数と内訳は画面幅により変更
  const toggles = [
    {
      key: "mobile",
      hiddenUnits: sortedUnits.slice(INITIAL_VISIBLE_COUNT.mobile),
      className: "md:hidden",
    },
    {
      key: "tablet",
      hiddenUnits: sortedUnits.slice(INITIAL_VISIBLE_COUNT.tablet),
      className: "hidden md:inline-flex lg:hidden",
    },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {sortedUnits.map((pkg, index) => (
        <PackageStatusTag
          key={pkg.id}
          href={`/drugs/${drugId}/packages/${pkg.id}`}
          label={pkg.name}
          status={pkg.currentShippingStatus}
          // 途中で改行しないようにする
          className={cn("whitespace-nowrap", !isExpanded && getCollapsedClass(index))}
        />
      ))}

      {/* 開閉ボタン（lg以上は全件表示） */}
      {toggles.map(({ key, hiddenUnits, className }) => {
        if (hiddenUnits.length === 0) return null

        const hiddenSummary = summarizeHidden(hiddenUnits)

        return (
          <button
            key={key}
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className={cn(TOGGLE_CLASS, className)}
          >
            {isExpanded ? (
              <>
                閉じる
                <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                他{hiddenUnits.length}包装
                {hiddenSummary && `（${hiddenSummary}）`}
                <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}
