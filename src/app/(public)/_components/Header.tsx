"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMe } from "@/hooks/useMe"
import { useAuthNavigation } from "@/hooks/useAuthNavigation"
import { logoutHandler } from "@/lib/supabase-auth/logoutHandler"
import type { CurrentUser } from "@/types/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BaseDropdown } from "@/components/Dropdown/BaseDropdown"
import { UserMenuItems } from "./userMenuItems"
import { LogIn, UserPlus } from "lucide-react"

/** ヘッダーのメニューの見た目（ログイン中・未ログインで共通） */
const MENU_CLASS_NAMES = {
  content: "w-52 p-2",
  header: "rounded-sm  px-3 py-2.5 text-weak",
  item: "font-medium px-3 py-2.5",
} as const

type AuthNavProps = {
  me: CurrentUser | null
  onNavigateMypage: () => void
  onNavigateBookmark: () => void
  onNavigateLogin: () => void
  onNavigateSignup: () => void
  onLogout: () => void
}

// ログイン状態に応じたヘッダーアイコンの表示
const AuthNav = ({
  me,
  onNavigateMypage,
  onNavigateBookmark,
  onNavigateLogin,
  onNavigateSignup,
  onLogout,
}: AuthNavProps) => {
  if (me) {
    // メールアドレスの頭文字（アイコン表示用）
    const emailInitial = me.email.charAt(0).toUpperCase()

    return (
      <BaseDropdown
        trigger={
          <Avatar className="h-8 w-8 cursor-pointer border  transition-opacity md:h-9 md:w-9">
            <AvatarFallback className="bg-primary text-sm text-primary-foreground font-bold md:text-base">
              {emailInitial}
            </AvatarFallback>
          </Avatar>
        }
        header={
          // 長いメールアドレスは省略し、全文はホバーで確認できるようにする
          <p className="truncate" title={me.email}>
            {me.email}
          </p>
        }
        headerClassName={MENU_CLASS_NAMES.header}
        items={UserMenuItems({ onNavigateBookmark,onNavigateMypage, onLogout })}
        itemClassName={MENU_CLASS_NAMES.item}
        className={MENU_CLASS_NAMES.content}
      />
    )
  }

  // 未ログイン：モバイルでも登録の入口が見えるよう、ボタンを並べる
  return (
    <div className="flex items-center gap-2 md:gap-4">
      <Button
        variant="outline"
        className="h-8 gap-1 rounded-lg px-3 text-xs font-bold hover:border-primary/60 hover:bg-primary/15 hover:text-primary md:h-10 md:gap-2 md:px-4 md:text-sm"
        onClick={onNavigateLogin}
      >
        <LogIn className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden="true" />
        ログイン
      </Button>


      <Button
        variant="accent"
        className="h-8 gap-1 rounded-lg px-3 text-xs font-bold md:h-10 md:gap-2 md:px-4 md:text-sm"
        onClick={onNavigateSignup}
      >
        <UserPlus className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden="true" />
        無料登録
      </Button>
    </div>
  )
}

export const Header = () => {
  const router = useRouter()
  const { me, isLoading } = useMe()

  // マイページへの遷移
  const handleNavigateMypage = () => {
    router.push("/mypage")
  }
  // マイページのブックマークへ遷移
  const handleNavigateBookmark = () => {
    router.push("/mypage/bookmarks")
  }

  // 認証ページへの遷移（ログイン後に元のページへ戻れるよう現在地を渡す）
  const { navigateToLogin: handleNavigateLogin, navigateToSignup: handleNavigateSignup } =
    useAuthNavigation()

  // ログアウト処理
  const handleLogout = async () => {
    await logoutHandler()
    router.replace("/")
  }

  return (
    <header className="sticky left-0 right-0 top-0 z-50 border-b  backdrop-blur-sm transition-all">
      <div className="flex size-full items-center justify-between px-5 py-3 md:px-10 md:py-4">
        {/* ロゴは全ページ共通のため見出しにしない（h1は各ページの主題に使う） */}
        <div className="text-xl font-bold text-primary md:text-3xl">
          <Link href="/">MedTrack</Link>
        </div>

        {!isLoading && (
          <AuthNav
            me={me}
            onNavigateMypage={handleNavigateMypage}
            onNavigateBookmark={handleNavigateBookmark}
            onNavigateLogin={handleNavigateLogin}
            onNavigateSignup={handleNavigateSignup}
            onLogout={handleLogout}
          />
        )}
      </div>
    </header>
  )
}
