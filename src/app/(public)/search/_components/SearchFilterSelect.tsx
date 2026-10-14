"use client"

import { Fragment } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { FilterOption } from "@/constants/searchFilter"

type SearchFilterSelectProps<T extends string> = {
  label: string
  options: FilterOption<T>[]
  selected: T[]
  onChange: (values: T[]) => void
  className?: string
}

// 閉じているときのボタンの文章（選択中の件数が分かるようにする）
const buildLabel = <T extends string>(options: FilterOption<T>[], selected: T[]): string => {
  if (selected.length === 0) return "すべて"
  
  const first = options.find((option) => option.value === selected[0])?.label ?? ""

  // 1件選択なら項目を表示、2件以上なら件数を表示
  return selected.length === 1 ? first : `${selected.length}件選択`
}

// 検索結果の絞り込み（複数選択のセレクト。製品区分・剤形で共通に使う）
export const SearchFilterSelect = <T extends string>({
  label,
  options,
  selected,
  onChange,
  className,
}: SearchFilterSelectProps<T>) => {
  // 選択済みなら解除、未選択なら追加
  const toggle = (value: T) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    )
  }

  return (
    // ラベルはセレクトの上に置く（表示件数と並べたときに高さを揃える）
    <div className={cn("flex flex-col items-start gap-1", className)}>
      <span className="text-weak whitespace-nowrap text-xs">{label}</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            // 選択するボタンなので、hoverで背景と文字色は変えない
            className="h-9 w-28 justify-between px-3 font-normal hover:bg-background hover:text-foreground"
          >
            <span className="truncate">{buildLabel(options, selected)}</span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
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

          {/* 選択肢ごとの選択（見出しが変わるところで、見出しや区切り線を入れる） */}
          {options.map((option, index) => {
            const prevGroup = index > 0 ? options[index - 1].group : undefined
            const isGroupStart = index > 0 && option.group !== prevGroup

            return (
              <Fragment key={option.value}>
                {isGroupStart && <DropdownMenuSeparator />}
                {option.group && option.group !== prevGroup && (
                  <DropdownMenuLabel className="py-1 text-xs font-normal text-weak">
                    {option.group}
                  </DropdownMenuLabel>
                )}
                <DropdownMenuCheckboxItem
                  checked={selected.includes(option.value)}
                  onCheckedChange={() => toggle(option.value)}
                  onSelect={(event) => event.preventDefault()}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              </Fragment>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
