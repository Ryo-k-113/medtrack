import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { ThreadsIcon, XIcon } from "./SocialIcons"

/** お問い合わせ先（Googleフォーム） */
const CONTACT_FORM_URL = "https://forms.gle/bez83YenoKxbWNrV9"

// フッターのリンク（お問い合わせのみ外部サイト）
const FOOTER_LINKS = [
  { href: "/terms", label: "利用規約・免責事項", isExternal: false },
  { href: "/privacy", label: "プライバシーポリシー", isExternal: false },
  { href: CONTACT_FORM_URL, label: "お問い合わせ", isExternal: true },
]

// SNSのアカウント（URLが空のものは表示しない）
const SOCIAL_LINKS = [
  { href: "https://x.com/medi__supply", label: "X", Icon: XIcon },
  { href: "https://www.threads.com/@medi_supply_info", label: "Threads", Icon: ThreadsIcon },
].filter((social) => social.href)

/** 外部サイトは別タブで開き、参照元情報を渡さない */
const EXTERNAL_LINK_PROPS = { target: "_blank", rel: "noopener noreferrer" }

/** フッター */
export const Footer = () => {
  return (
    <footer className="mt-auto bg-primary/90 text-white">
      <div className="mx-auto max-w-7xl px-5 py-5 md:px-10 md:py-8">
        {/* 上段：サービス名・SNS・リンク */}
        <div className="grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-4">
          <p className="text-lg font-bold md:text-2xl">MedTrack</p>

          <ul className="col-start-1 flex items-center gap-3">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  {...EXTERNAL_LINK_PROPS}
                  aria-label={`MedTrackの${label}（新しいタブで開きます）`}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary/90 transition-colors hover:bg-white/80"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>

          <nav className="col-start-2 row-span-2 row-start-1 flex flex-col items-start sm:flex-row sm:items-center sm:gap-x-6 sm:self-center">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                {...(link.isExternal && EXTERNAL_LINK_PROPS)}
                className="inline-flex items-center gap-1 py-1.5 text-xs underline-offset-4 hover:underline sm:text-sm"
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
        <div className="mt-4 border-t border-white/20 pt-4 md:mt-6">
          <p className="text-xs">
            Copyright © {new Date().getFullYear()} MedTrack
          </p>
        </div>
      </div>
    </footer>
  )
}
