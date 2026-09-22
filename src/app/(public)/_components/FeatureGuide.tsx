"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, History, JapaneseYen, Package, ScanLine } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/** 畳んだ状態を保持するキー */
const COLLAPSED_KEY = "FeatureGuideCollapsed"

/** ブラウザの設定で保存領域を使えない場合があるため、失敗しても表示を妨げない */
const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === "true"
  } catch {
    return false
  }
}

const saveCollapsed = (collapsed: boolean) => {
  try {
    localStorage.setItem(COLLAPSED_KEY, String(collapsed))
  } catch {
    // 保存できない場合は、このページを開いている間だけ反映する
  }
}

/** できること一覧 */
const FEATURES = [
  {
    Icon: Package,
    iconClassName: "bg-primary/10 text-primary",
    title: "包装ごとの出荷状況",
    description:
      "通常出荷・限定出荷・出荷停止・販売中止を包装単位で表示します。同じ製品でも包装によって違う状況が、ひと目で分かります。",
  },
  {
    Icon: ScanLine,
    iconClassName: "bg-status-normal/20 text-status-normal-foreground",
    title: "コードからも検索",
    description:
      "GS1コード（販売・調剤）、HOTコード、統一商品コード、YJコードで検索できます。製品名・成分名は、ひらがなや全角で入力しても一致します。",
  },
  {
    Icon: History,
    iconClassName: "bg-status-transfer/30 text-status-transfer-foreground",
    title: "出荷状況の変更履歴",
    description:
      "いつ・どの包装が・どう変わったかを履歴で確認できます。カレンダーでは、これからの適用日も分かります。",
  },
  {
    Icon: JapaneseYen,
    iconClassName: "bg-status-limited/40 text-status-limited-foreground",
    title: "薬価と添付文書",
    description:
      "最新の薬価と単位、先発品・後発品の区分を表示します。添付文書も確認可能です",
  },
]

/**
 * トップページの「できること」の案内
 * 畳んだ状態は端末に保存し、次に開いたときも畳んだままにする
 */
export const FeatureGuide = () => {
  // サーバーでは保存領域を読めないため、まず開いた状態で描画してから反映する
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    setIsCollapsed(readCollapsed())
  }, [])

  const handleToggle = () => {
    setIsCollapsed((prev) => {
      saveCollapsed(!prev)
      return !prev
    })
  }

  return (
    <section className="space-y-4 py-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-xl font-bold">MedTrackでできること</h2>

        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={!isCollapsed}
          aria-controls="feature-guide-list"
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold text-weak transition-colors hover:bg-surface"
        >
          {isCollapsed ? "開く" : "閉じる"}
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
      </div>

      <div
        id="feature-guide-list"
        className={cn("grid grid-cols-1 gap-4 md:grid-cols-2", isCollapsed && "hidden")}
      >
        {FEATURES.map(({ Icon, iconClassName, title, description }) => (
          <Card key={title} className="shadow-sm">
            <CardContent className="flex items-start gap-3 px-4 py-4 md:px-5">
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  iconClassName
                )}
              >
                <Icon className="h-5 w-5" />
              </span>

              <div className="space-y-1">
                <h3 className="font-bold">{title}</h3>
                <p className="text-sm text-weak">{description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
