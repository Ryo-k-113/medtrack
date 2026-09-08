import Link from "next/link"

/** お問い合わせ先（Googleフォーム） */
const CONTACT_FORM_URL = "https://forms.gle/bez83YenoKxbWNrV9"

// フッターのリンク（お問い合わせのみ外部サイト）
const FOOTER_LINKS = [
  { href: "/terms", label: "利用規約・免責事項", isExternal: false },
  { href: "/privacy", label: "プライバシーポリシー", isExternal: false },
  { href: CONTACT_FORM_URL, label: "お問い合わせ", isExternal: true },
]

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-primary/80 bg-primary/80">
      {/* モバイル幅ではリンクを上、サービス名と著作権表示を下に配置する */}
      <div className="mx-auto flex max-w-7xl flex-col-reverse gap-6 px-4 py-4 md:flex-row md:justify-between md:gap-8 md:px-6">

        {/* 左：サービス名と著作権表示（下寄せ） */}
        <div className="flex flex-col justify-between gap-2">
          <p className="text-lg font-bold text-white md:text-2xl">MedTrack</p>

          <p className="text-xs text-white/80 sm:text-sm">
            Copyright © {new Date().getFullYear()} MedTrack
          </p>
        </div>

        {/* 右：リンクと、その下に情報の位置づけ */}
        <div className="flex items-center space-y-4 md:text-right">
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 md:justify-end">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                // 外部サイトは別タブで開き、参照元情報を渡さない
                {...(link.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                className="text-xs text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline
                sm:text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
