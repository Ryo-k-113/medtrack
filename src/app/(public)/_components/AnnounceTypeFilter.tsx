"use client"

import type { AnnounceType } from "@prisma/client"
import { cn } from "@/lib/utils"
import { STATUS_CHIP_CLASS, STATUS_ICON } from "@/constants/statusChip"

// 告知タイプの選択肢
const ANNOUNCE_TYPE_OPTIONS: { value: AnnounceType; label: string }[] = [
  { value: "NORMAL_SHIPMENT", label: "通常出荷" },
  { value: "LIMITED_SHIPMENT", label: "限定出荷" },
  { value: "SHIPMENT_SUSPENDED", label: "出荷停止" },
  { value: "DISCONTINUED_SALE", label: "販売中止" },
  { value: "TRANSFER_OF_SALE", label: "販売移管" },
]

// チップ共通のスタイル（アイコンと文字の横並び）
const CHIP_CLASS =
  "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-colors"

// 未選択時のスタイル
const CHIP_INACTIVE_CLASS = "border-border bg-background text-weak hover:bg-surface"

type AnnounceTypeFilterProps = {
  selected: AnnounceType[]
  onChange: (types: AnnounceType[]) => void
  className?: string
}

// 告知タイプによる絞り込み（チップボタンで複数選択）
export const AnnounceTypeFilter = ({
  selected,
  onChange,
  className,
}: AnnounceTypeFilterProps) => {
  // 選択済みなら解除、未選択なら追加
  const toggle = (type: AnnounceType) => {
    onChange(
      selected.includes(type)
        ? selected.filter((t) => t !== type)
        : [...selected, type]
    )
  }

  return (
    // モバイルは折り返さず横スクロール、md以上は折り返して表示する
    <div
      className={cn(
        "flex items-center gap-2 overflow-x-auto md:flex-wrap md:overflow-x-visible",
        className
      )}
    >

      {/* すべて：絞り込みの解除 */}
      <button
        type="button"
        onClick={() => onChange([])}
        aria-pressed={selected.length === 0}
        className={cn(
          CHIP_CLASS,
          selected.length === 0
            ? "border-primary bg-primary/10 text-primary"
            : CHIP_INACTIVE_CLASS
        )}
      >
        すべて
      </button>

      {/* 告知タイプごとのチップ */}
      {ANNOUNCE_TYPE_OPTIONS.map((option) => {
        const isSelected = selected.includes(option.value)
        // 検索結果の出荷状況ガイド・包装チップと共通アイコン
        const Icon = STATUS_ICON[option.value]

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            aria-pressed={isSelected}
            className={cn(
              CHIP_CLASS,
              isSelected ? STATUS_CHIP_CLASS[option.value] : CHIP_INACTIVE_CLASS
            )}
          >
            <Icon className="h-3 w-3" aria-hidden="true" />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
