
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


type PaginationPageSizeProps = {
  limit: number
  options?: number[]
  onLimitChange: (limit: number) => void
}

export const PaginationPageSize = ({
  limit,
  options = [10, 20, 50],
  onLimitChange,
}: PaginationPageSizeProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-weak whitespace-nowrap">
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