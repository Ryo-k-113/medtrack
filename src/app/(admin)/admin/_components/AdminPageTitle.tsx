"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

type AdminPageTitleProps = {
  title: string
  backTo?: string     
  backButtonText?: string
  isLoading?: boolean    
}

export const AdminPageTitle = ({
  title,
  backTo,
  backButtonText = "戻る",
  isLoading = false,
}: AdminPageTitleProps) => {

  // ローディング表示
  if (isLoading) return (
    <div className="flex items-center justify-between gap-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-8 w-36" />
    </div>
  )

  return (
    <div className="flex justify-between items-center pb-4 border-b">
      <div>
        <h2 className="text-lg font-bold text-foreground">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* backTo が指定されている時だけ戻るボタンを表示 */}
        {backTo && (
          <Button variant="outline" asChild>
            <Link href={backTo}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backButtonText}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}