import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type SectionCardProps = {
  title?: React.ReactNode
  headerAction?: React.ReactNode
  children: React.ReactNode
  className?: string
}

// 各ページのセクションを囲む共通カード
export const SectionCard = ({ title, headerAction, children, className }: SectionCardProps) => (
  <Card className="bg-background p-4 text-foreground shadow-sm md:rounded-2xl md:p-6">
    {(title || headerAction) && (
      <CardHeader className="mb-4 flex-row items-center justify-between space-y-0 p-0">
        {title && <CardTitle className="text-base font-bold">{title}</CardTitle>}
        {headerAction}
      </CardHeader>
    )}
    <CardContent className={cn("p-0", className)}>{children}</CardContent>
  </Card>
)
