"use client"

import Link from "next/link"
import { Check, ChevronRight, Lightbulb, Search } from "lucide-react"
import { SectionCard } from "@/components/Card/SectionCard"
import { useMe } from "@/hooks/useMe"
import { cn } from "@/lib/utils"

/** 押すとそのまま検索できる例（医薬品名＋規格） */
const SEARCH_EXAMPLES = ["アムロジピン 5", "フェブキソスタット 20", "ロスバスタチン 5"]

/**
 * 検索キーワードがないときの表示
 * 検索例と検索のコツを示し、最初の検索をしてもらう
 */
export const SearchEmptyState = () => {
  const { isLoggedIn, isLoading } = useMe()
  // ログイン状態の確認中は会員向けの案内表示
  const isGuest = !isLoading && !isLoggedIn

  // 検索のコツ
  // 括弧の補足は途中で折り返さないよう、本文と分けて持つ
  const tips = [
    { text: "医薬品名の一部だけでも検索できます", note: "（例：アムロ）" },
    { text: "スペースで区切ると、規格などで絞り込めます", note: "（例：アムロジピン 5）" },
    {
      text: "「,」や「、」で区切ると、3件まで同時に検索できます",
      note: isGuest ? "（2件目からは無料登録で表示）" : undefined,
    },
    { text: "ひらがな・カタカナ、全角・半角のどちらで入力しても検索できます" },
    { text: "YJコードやGS1コードなどのコードでも検索できます" },
  ]

  return (

    <SectionCard
      title="キーワードを入力してください"
      icon={Search}
      cardClassName="p-5 md:px-10 md:py-8"
    >
      {/* 検索例と検索のコツは別のまとまりとして、間を広めに空ける */}
      <div className="space-y-10">
        {/* 検索例（押すとその検索結果へ） */}
        <div className="space-y-3">
          <p className="flex flex-wrap items-baseline gap-x-2 text-sm font-bold">
            検索例
            <span className="text-xs font-normal text-weak">押すとそのまま検索できます</span>
          </p>

          {/* 検索例のリンク　 */}
          <div className="grid w-fit gap-3 sm:flex sm:w-auto sm:flex-wrap sm:gap-2">
            {SEARCH_EXAMPLES.map((example) => (
              <Link
                key={example}
                href={`/search?query=${encodeURIComponent(example)}`}
                className={cn(
                  "group flex h-11 items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 text-sm font-medium text-primary shadow-sm transition",
                  "hover:border-primary hover:bg-primary/10 active:scale-[0.98]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "md:h-10"
                )}
              >
                <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="flex-1">{example}</span>
                <ChevronRight
                  className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* 検索のコツ */}
        <div className="space-y-3">
          <p className="flex items-center gap-1.5 text-sm font-bold">
            <Lightbulb className="h-4 w-4 text-primary" aria-hidden="true" />
            検索のコツ
          </p>
          
          {/* 説明文*/}
          <ul className="space-y-2.5 md:space-y-1.5">
            {tips.map(({ text, note }) => (
              <li
                key={text}
                className="flex items-start gap-1.5 text-[13px] leading-relaxed text-weak md:text-sm"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  {text}
                  {note && <span className="inline-block">{note}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionCard>
  )
}
