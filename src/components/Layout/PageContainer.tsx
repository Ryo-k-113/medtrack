import { cn } from "@/lib/utils"

type PageContainerProps = {
  children: React.ReactNode
  className?: string
}

/**
 * ページ共通のコンテナ
 * 最大幅や余白はclassNameで上書きする
 */
export const PageContainer = ({ children, className }: PageContainerProps) => (
  <div
    className={cn(
      "mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10",
      className
    )}
  >
    {children}
  </div>
)
