import Link from "next/link"
import { ExternalLink } from "lucide-react"

/** お問い合わせ先（Googleフォーム） */
const CONTACT_FORM_URL = "https://forms.gle/bez83YenoKxbWNrV9"

// フッターのリンク（お問い合わせのみ外部サイト）
const FOOTER_LINKS = [
  { href: "/terms", label: "利用規約・免責事項", isExternal: false },
  { href: "/privacy", label: "プライバシーポリシー", isExternal: false },
  { href: CONTACT_FORM_URL, label: "お問い合わせ", isExternal: true },
]

/** フッター */
export const Footer = () => {
  return (
    <footer className="mt-auto bg-primary/90 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        {/* 上段：サービス名とリンク（モバイル幅ではリンクを上、サービス名を下に配置する） */}
        <div className="flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-lg font-bold md:text-2xl">MedTrack</p>

          <nav className="flex flex-wrap items-center gap-x-6 md:justify-end">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                // 外部サイトは別タブで開き、参照元情報を渡さない
                {...(link.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                // タップしやすいよう、文字の上下にも押せる範囲を確保する
                className="inline-flex items-center gap-1 py-2 text-xs underline-offset-4 hover:underline sm:text-sm"
              >
                {link.label}

                {/* サイトの外に出ることが分かるようにする */}
                {link.isExternal && (
                  <>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    <span className="sr-only">（新しいタブで開きます）</span>
                  </>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* 下段：区切り線と著作権表示 */}
        <div className="mt-6 border-t border-white/20 pt-4">
          <p className="text-xs">
            Copyright © {new Date().getFullYear()} MedTrack
          </p>
        </div>
      </div>
    </footer>
  )
}
