"use client"

import type { ProductType } from "@prisma/client"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// 製品区分の選択肢
const PRODUCT_TYPE_OPTIONS: { value: ProductType; label: string }[] = [
  { value: "BRAND_NAME", label: "先発品" },
  { value: "QUASI_BRAND_NAME", label: "準先発品" },
  { value: "GENERIC", label: "後発品" },
  { value: "OTHER", label: "その他" },
]

type ProductTypeFilterProps = {
  selected: ProductType[]
  onChange: (types: ProductType[]) => void
  className?: string
}

// 閉じているときのボタンの文章（選択中の件数が分かるようにする）
const buildLabel = (selected: ProductType[]): string => {
  if (selected.length === 0) return "すべて"

  const first = PRODUCT_TYPE_OPTIONS.find((option) => option.value === selected[0])?.label ?? ""

  return selected.length === 1 ? first : `${selected.length}件選択`
}

// 製品区分による絞り込み（複数選択）
export const ProductTypeFilter = ({
  selected,
  onChange,
  className,
}: ProductTypeFilterProps) => {
  // 選択済みなら解除、未選択なら追加
  const toggle = (type: ProductType) => {
    onChange(
      selected.includes(type)
        ? selected.filter((t) => t !== type)
        : [...selected, type]
    )
  }

  return (
    // ラベルはセレクトの上に置く（表示件数と並べたときに高さを揃える）
    <div className={cn("flex flex-col items-start gap-1", className)}>
      <span className="text-weak whitespace-nowrap text-xs">製品区分</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            // 選択するボタンなので、hoverで背景と文字色は変えない
            className="h-9 w-28 justify-between px-3 font-normal hover:bg-background hover:text-foreground"
          >
            <span className="truncate">{buildLabel(selected)}</span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          {/* すべて：絞り込みの解除 */}
          <DropdownMenuCheckboxItem
            checked={selected.length === 0}
            onCheckedChange={() => onChange([])}
            // 続けて選べるよう、選択してもメニューを閉じない
            onSelect={(event) => event.preventDefault()}
          >
            すべて
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          {/* 製品区分ごとの選択 */}
          {PRODUCT_TYPE_OPTIONS.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selected.includes(option.value)}
              onCheckedChange={() => toggle(option.value)}
              onSelect={(event) => event.preventDefault()}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
