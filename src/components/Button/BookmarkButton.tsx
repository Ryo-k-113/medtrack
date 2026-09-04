"use client"

import { Bookmark } from "lucide-react"
import { toast } from "sonner"
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useBookmarks } from "@/hooks/useBookmarks"
import { cn } from "@/lib/utils"


type BookmarkButtonProps = {
  drugId: number
  drugName?: string
  className?: string
}

// 医薬品のブックマークを追加・解除するボタン
export const BookmarkButton = ({ drugId, drugName, className }: BookmarkButtonProps) => {
  const { isBookmarked, toggleBookmark, addBookmark, isLoggedIn } = useBookmarks()

  const bookmarked = isBookmarked(drugId)
  const label = bookmarked ? "ブックマークを解除" : "ブックマークに追加"

  const handleClick = async () => {
    // 未ログイン時はログインを案内する
    if (!isLoggedIn) {
      toast.error("ブックマークにはログインが必要です")
      return
    }

    try { 
      // ブックマークの切り替え
      await toggleBookmark(drugId)

      // drugNameが渡されている場合のみ結果を通知する
      if (drugName) {
        if (bookmarked) {
          toast.success(<span>{drugName}の<br />ブックマークを解除しました</span>, {
            duration: 8000, 
            action: {
              label: "元に戻す",
              onClick: () => {
                addBookmark(drugId).catch(() => {
                  toast.error("ブックマークの復元に失敗しました")
                })
              },
            },
          })
        } else {
          toast.success(<span>{drugName}を<br />ブックマークしました</span>)
        }
      }
    } catch {
      toast.error("ブックマークの更新に失敗しました")
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleClick}
            aria-label={label}
            aria-pressed={bookmarked}
            className={cn(
              "shrink-0 text-weak hover:text-primary",
              bookmarked && "text-primary",
              className
            )}
        >  
            <Bookmark 
              className="h-5 w-5" 
              fill={bookmarked? "currentColor" : "none" }
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
