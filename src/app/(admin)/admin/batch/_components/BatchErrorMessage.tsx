"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDateTime } from "@/utils/format"
import type { BatchLog } from "@/types/admin/batch"

type BatchErrorMessageProps = {
  errorCode: BatchLog["errorCode"]
  errorMessage: BatchLog["errorMessage"]
  failedAt: BatchLog["failedAt"]
  className?: string
}


export const BatchErrorMessage = ({
  errorCode,
  errorMessage,
  failedAt,
  className,
}: BatchErrorMessageProps) => {
  const [isOpen, setIsOpen] = useState(false)

  // 成功時
  if (!errorMessage) {
    return <span className="text-weak">ー</span>
  }

  return (
    <div className={cn("space-y-2", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        title={errorMessage}
        className="flex items-center gap-1 text-destructive hover:opacity-80"
      >
        {/* エラーコードがない場合は汎用のラベルを出す */}
        <code className="text-sm">{errorCode ?? "エラー詳細"}</code>

        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {/* 展開時に失敗日時とエラーメッセージを表示する */}
      {isOpen && (
        <div className="space-y-1 rounded-md border bg-surface p-2 text-xs text-weak">
          {failedAt && (
            <div className="flex gap-2">
              <span className="shrink-0">失敗日時</span>
              <span>{formatDateTime(failedAt)}</span>
            </div>
          )}

          <p className="whitespace-pre-wrap break-words">{errorMessage}</p>
        </div>
      )}
    </div>
  )
}
