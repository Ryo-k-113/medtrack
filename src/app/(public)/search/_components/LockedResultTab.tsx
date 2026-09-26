"use client"

import { TabsContent } from "@/components/ui/tabs"
import { SignupPrompt } from "@/components/auth/SignupPrompt"
import type { useDrugSearch } from "@/hooks/useDrugSearch"
import { DrugCard } from "./DrugCard"

/** ぼかして見せる検索結果の件数 */
const PREVIEW_COUNT = 3

type LockedResultTabProps = {
  keyword: string
  result: ReturnType<typeof useDrugSearch>
}

/**
 * 未ログインで2件目以降のキーワードを検索したときのタブの中身
 * 実際の検索結果をぼかして見せ、その上に無料登録の案内を重ねる
 */
export const LockedResultTab = ({ keyword, result }: LockedResultTabProps) => {
  const { drugs, isLoading } = result
  const hasPreview = !isLoading && drugs.length > 0

  return (
    <TabsContent value={keyword} className="pt-4">
      <div className="grid">
        <div
          ref={(element) => element?.setAttribute("inert", "")}
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 max-h-[560px] select-none space-y-4 overflow-hidden blur-[3px]"
        >
          {drugs.slice(0, PREVIEW_COUNT).map((drug) => (
            <DrugCard key={drug.id} drug={drug} />
          ))}
        </div>

        {hasPreview && (
          <div className="pointer-events-none relative col-start-1 row-start-1 h-32 self-end bg-gradient-to-b from-transparent to-gray-50" />
        )}

        {/* 登録の案内 */}
        <div className="relative col-start-1 row-start-1 flex items-start justify-center px-2 py-6 md:py-12">
          <SignupPrompt
            title="複数検索は無料登録で使えます"
            className="w-full max-w-md rounded-2xl border bg-background/95 p-5 shadow-lg md:max-w-xl md:p-8"
          />
        </div>
      </div>
    </TabsContent>
  )
}
