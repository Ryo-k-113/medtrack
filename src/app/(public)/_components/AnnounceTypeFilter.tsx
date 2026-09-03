"use client"

import type { AnnounceType } from "@prisma/client"
import { cn } from "@/lib/utils"

// 告知タイプの選択肢
const ANNOUNCE_TYPE_OPTIONS: {
  value: AnnounceType
  label: string
  activeClassName: string
}[] = [
  {
    value: "NORMAL_SHIPMENT",
    label: "通常出荷",
    activeClassName: "border-status-normal bg-status-normal/20 text-status-normal-foreground",
  },
  {
    value: "LIMITED_SHIPMENT",
    label: "限定出荷",
    activeClassName: "border-amber-200 bg-status-limited/20 text-status-limited-foreground",
  },
  {
    value: "SHIPMENT_SUSPENDED",
    label: "出荷停止",
    activeClassName: "border-status-stop/70 bg-status-stop/20 text-status-stop-foreground",
  },
  {
    value: "DISCONTINUED_SALE",
    label: "販売中止",
    activeClassName: "border-status-discontinued/50 bg-status-discontinued/20 text-status-discontinued",
  },
  {
    value: "TRANSFER_OF_SALE",
    label: "販売移管",
    activeClassName: "border-blue-300 bg-status-transfer/20 text-status-transfer-foreground",
  },
]

// チップ共通のスタイル
const CHIP_CLASS =
  "rounded-full border px-3 py-1 text-xs font-semibold transition-colors"

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
    <div className={cn("flex flex-wrap items-center gap-2", className)}>

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

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            aria-pressed={isSelected}
            className={cn(
              CHIP_CLASS,
              isSelected ? option.activeClassName : CHIP_INACTIVE_CLASS
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
