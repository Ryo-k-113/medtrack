"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { DrugCard } from "@/app/(public)/search/_components/DrugCard"
import { useBookmarkedDrugs } from "@/hooks/useBookmarkedDrugs"


export default function BookmarksPage() {
  const { drugs, isLoading, error } = useBookmarkedDrugs()

  // 一覧の表示分岐
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <p className="py-12 text-center text-sm text-destructive">
          ブックマークの取得中にエラーが発生しました
        </p>
      )
    }

    if (drugs.length === 0) {
      return (
        <p className="py-12 text-center text-sm text-weak">
          ブックマークした医薬品はまだありません。
        </p>
      )
    }

    return (
      <div className="space-y-4">
        {drugs.map((drug) => (
          <DrugCard key={drug.id} drug={drug} notifyBookmarkChange />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold md:text-xl">ブックマーク</h2>
        {!isLoading && drugs.length > 0 && (
          <span className="text-sm text-weak">{drugs.length}件 / 1000件</span>
        )}
      </div>

      {renderContent()}
    </div>
  )
}
