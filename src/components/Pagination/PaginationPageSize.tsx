
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"


type PaginationPageSizeProps = {
  limit: number
  options?: number[]
  onLimitChange: (limit: number) => void
  direction?: "horizontal" | "vertical"
}

export const PaginationPageSize = ({
  limit,
  options = [10, 20, 50],
  onLimitChange,
  direction = "horizontal",
}: PaginationPageSizeProps) => {
  const isVertical = direction === "vertical"

  return (
    <div className={cn("flex", isVertical ? "flex-col items-start gap-1" : "items-center gap-2")}>
      <span className={cn("text-weak whitespace-nowrap", isVertical ? "text-xs" : "text-sm")}>
        表示件数
      </span>

      {/* 表示件数の選択 */}
      <Select
        value={String(limit)}
        onValueChange={(value) => onLimitChange(Number(value))}
      >
        <SelectTrigger className="w-20 h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}件
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}