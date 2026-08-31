"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bookmark, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// マイページのメニューアイテム
const MENU_ITEMS = [
  { href: "/mypage/bookmarks", label: "ブックマーク", icon: Bookmark },
  { href: "/mypage/account", label: "アカウント設定", icon: Settings },
]

export default function MyPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  // 現在のページ選択の判定
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)


  return (
    <div className="mx-auto flex max-w-5xl flex-col pt-4 md:flex-row md:gap-8 md:px-6 md:py-10">

      {/* サイドメニュー（md以上） */}
      <aside className="hidden shrink-0 md:block md:w-56">
        <nav className="flex flex-col gap-1">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-secondary text-foreground"
                  : "text-weak hover:bg-surface hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* タブメニュー（md未満・横スクロール） */}
      <nav className="relative mx-4 flex gap-6 overflow-x-auto border-b md:hidden">
      {MENU_ITEMS.map((item) => {
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex shrink-0 items-center gap-1 font-bold whitespace-nowrap py-2 text-sm transition-colors",
              active ? "text-primary" : "text-weak"
            )}
          >
            {item.label}
            
            {/* 選択したアイテムに下線アニメーション */}
            {active && (
              <motion.span
                layoutId="activeMobileUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                }}
              />
            )}
          </Link>
        );
      })} 
      </nav>

      {/* コンテンツ */}
      <main className="min-w-0 flex-1 px-4 py-6 md:px-0 md:py-0">
        {children}
      </main>
    </div>
  )
}
