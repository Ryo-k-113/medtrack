import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type SectionCardProps = {
  title?: React.ReactNode
  icon?: LucideIcon 
  headerAction?: React.ReactNode
  children: React.ReactNode
  className?: string
}

// 各ページのセクションを囲む共通カード
export const SectionCard = ({
  title,
  icon: Icon,
  headerAction,
  children,
  className,
}: SectionCardProps) => (
  <Card className="bg-background p-4 text-foreground shadow-sm md:rounded-2xl md:p-6">
    {(title || headerAction) && (
      <CardHeader className="mb-4 flex-row items-center justify-between space-y-0 p-0">
        {title && (
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            {/* 淡い背景つきのアイコン */}
            {Icon && (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary md:h-8 md:w-8">
                <Icon className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
              </span>
            )}
            {title}
          </CardTitle>
        )}
        {headerAction}
      </CardHeader>
    )}
    <CardContent className={cn("p-0", className)}>{children}</CardContent>
  </Card>
)
