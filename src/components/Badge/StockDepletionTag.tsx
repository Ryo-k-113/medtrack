import { PackageX } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StockDepletionTagProps = {
  className?: string
}

/** 在庫消尽後に適用される告知のタグ（告知種別のバッジの横に並べる） */
export const StockDepletionTag = ({ className }: StockDepletionTagProps) => {
  return (
    <Badge
      variant="outline"
      className={cn("gap-1 whitespace-nowrap rounded-md bg-background font-medium text-foreground", className)}
    >
      <PackageX className="h-3 w-3 shrink-0 text-weak" aria-hidden="true" />
      在庫消尽後
    </Badge>
  )
}
