import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type InfoItem = {
  label: string
  value: React.ReactNode
  isDivider?: boolean
}

type InfoCardProps = {
  title: string
  items: InfoItem[]
  headerAction?: React.ReactNode
  footer?: React.ReactNode
  className?: string       
}

export const InfoCard = ({
  title,
  items,
  headerAction,
  footer,
  className,
}: InfoCardProps) => {
  return (
    <Card className={cn("w-full max-w-xl shadow-sm border", className)}>
      <CardHeader className="p-6">
        <div className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-md font-bold">{title}</CardTitle>
          {/* ヘッダーアクション */}
          {headerAction && (
            <div>{headerAction}</div>
          )}
        </div>
      </CardHeader>

      <CardContent className="text-sm">
        {items.map((item) => (
          <div key={item.label} className="w-full">
            {item.isDivider ? (
              <div className="my-3 border-b" />
            ) : (
              <div className="grid grid-cols-3 py-4 items-center border-b">
                <dt>{item.label}</dt>
                <dd className={`col-span-2 text-end break-all ${item.value ? "" : "text-slate-400"}`}>
                  {item.value ?? "—"}
                </dd>
              </div>
            )}
          </div>
        ))}

        {/* フッター */}
        {footer && (
          <div className="pt-4">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  )
}