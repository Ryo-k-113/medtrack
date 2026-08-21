"use client"
import { Button } from "@/components/ui/button"


type ErrorProps = {
  reset: () => void
}

export default function Error({ reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-[400px]">
      <p className="text-destructive">
        エラーが発生しました
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