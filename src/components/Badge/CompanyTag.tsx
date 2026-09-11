import { Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type CompanyTagProps = {
  name: string
  className?: string
}

/**
 * 販売会社のタグ
 * 色付きの製品区分（分類）と見分けられるよう、白地に枠線とアイコンの控えめな見た目にする
 * 後発品ではメーカーで選ぶことも多いため、文字色は薄くしすぎない
 */
export const CompanyTag = ({ name, className }: CompanyTagProps) => (
  <Badge
    variant="outline"
    className={cn("gap-1 rounded-md bg-background font-medium text-foreground", className)}
  >
    <Building2 className="h-3 w-3 shrink-0 text-weak" />
    {name}
  </Badge>
)
