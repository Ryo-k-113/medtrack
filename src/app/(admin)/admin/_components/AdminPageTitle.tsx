"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

type AdminPageTitleProps = {
  title: string
  backTo?: string     
  backButtonText?: string   
}

export const AdminPageTitle = ({
  title,
  backTo,
  backButtonText = "戻る",
}: AdminPageTitleProps) => {
  return (
    <div className="flex justify-between items-center pb-4 border-b mb-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
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