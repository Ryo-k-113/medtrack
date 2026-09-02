"use client"

import { Copy } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type CopyButtonProps = {
  value: string
  label?: string  // トーストメッセージに使うラベル
  buttonText?: string
  className?: string
}

// 値をクリップボードにコピーするボタン
export const CopyButton = ({ value, label, buttonText, className }: CopyButtonProps) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    const message = label ? `${label}をコピーしました` : "コピーしました"
      toast.success(message)
  }

  if (buttonText) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-md border bg-background px-2.5 py-1.5 text-xs text-weak transition-colors hover:border-primary hover:text-primary",
          className
        )}
      >
        <Copy className="h-4 w-4" />
        {buttonText}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="コピー"
      className={cn("text-weak transition-colors hover:text-primary", className)}
    >
      <Copy className="h-4 w-4" />
    </button>
  )
}
