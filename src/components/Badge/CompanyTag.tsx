import { Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ResponsiveLabel } from "@/components/Badge/ResponsiveLabel"
import { cn } from "@/lib/utils"
import { toShortCompanyName } from "@/utils/companyName"

type CompanyTagProps = {
  name: string
  compact?: boolean  //モバイルでは略語での表示
  className?: string
}

/**  販売会社のタグ  */
export const CompanyTag = ({ name, compact = false, className }: CompanyTagProps) => {
  // compact のときだけ略称にする
  const shortName = compact ? toShortCompanyName(name) : name

  return (
    <Badge
      variant="outline"
      size={compact ? "compact" : "default"}
      className={cn("gap-1 rounded-md bg-background font-medium text-foreground", className)}
    >
      <Building2 className="h-3 w-3 shrink-0 text-weak" />
      <ResponsiveLabel short={shortName} full={name} />
    </Badge>
  )
}
