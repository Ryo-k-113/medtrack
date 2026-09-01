"use client"

import { Button } from "@/components/ui/button"

type ErrorProps = {
  reset: () => void
}

export default function PackageDetailError({ reset }: ErrorProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <p className="text-destructive">
        包装情報の取得に失敗しました
      </p>
      <Button
        variant="outline"
        className="w-[120px]"
        onClick={reset}
      >
        再試行
      </Button>
    </div>
  )
}
