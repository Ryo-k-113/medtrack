"use client"

import { ChevronDown, ChevronUp, History, Package, ScanLine, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { cn } from "@/lib/utils"

/** 畳んだ状態を保持するキー */
const COLLAPSED_KEY = "FeatureGuideCollapsed"

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
      "GS1コード、統一商品コード、YJコードなど各種コードで検索できます。製品名・成分名は、ひらがなや全角で入力しても一致します。",
  },
  {
    Icon: History,
    iconClassName: "bg-status-transfer/30 text-status-transfer-foreground",
    title: "出荷状況の変更履歴",
    description:
      "包装詳細ページでは告知の履歴を確認できます。更新情報カレンダーでは告知日での検索も可能です。",
  },
  {
    Icon: Tag,
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
  // 更新情報を先に見せるため、初めは畳んでおく（開いた状態は端末に保存して引き継ぐ）
  // 保存が無い場合は畳んだまま（一度開いた人にだけ、開いた状態を引き継ぐ）
  const [storedCollapsed, setStoredCollapsed] = useLocalStorage(COLLAPSED_KEY)
  const isCollapsed = storedCollapsed !== "false"

  const handleToggle = () => {
    setStoredCollapsed(String(!isCollapsed))
  }

  return (
    <section className="space-y-4">
      {/* 見出しの行ごと開閉のボタンにする（畳んだときも1つのまとまりに見えるようにする） */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={!isCollapsed}
        aria-controls="feature-guide-list"
        className="flex w-full items-center justify-between gap-3 rounded-xl border bg-background px-4 py-3 text-left shadow-sm transition-colors hover:bg-surface md:px-5"
      >
        <h2 className="font-bold md:text-lg">MedTrackでできること</h2>

        <span className="flex shrink-0 items-center gap-1 text-sm text-weak">
          {isCollapsed ? "開く" : "閉じる"}
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </span>
      </button>

      <div
        id="feature-guide-list"
        className={cn(
          "grid grid-cols-1 gap-4 md:grid-cols-2",
          isCollapsed && "hidden"
        )}
      >
        {FEATURES.map(({ Icon, iconClassName, title, description }) => (
          <Card key={title} className="shadow-sm">
            <CardContent className="space-y-2 px-4 py-4 md:px-5">
              {/* 1段目：アイコンと見出し（縦の中心をそろえる） */}
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg md:h-8 md:w-8",
                    iconClassName
                  )}
                >
                  <Icon className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
                </span>
                <h3 className="font-bold">{title}</h3>
              </div>

              {/* 2段目：説明 */}
              <p className="text-sm text-weak">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
