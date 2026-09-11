"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMe } from "@/hooks/useMe"
import { logoutHandler } from "@/lib/supabase-auth/logoutHandler"
import { REDIRECT_TO_QUERY_KEY } from "@/constants/auth"
import type { CurrentUser } from "@/types/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BaseDropdown } from "@/components/Dropdown/BaseDropdown"
import { UserMenuItems } from "./userMenuItems"
import { GuestMenuItems } from "./guestMenuItems"
import { LogIn, CircleUserRound, UserPlus } from "lucide-react"

/** ログインページのパス */
const LOGIN_PATH = "/login"

/** 新規登録ページのパス */
const SIGNUP_PATH = "/signup"

/** 戻り先に含めないパス（認証ページ自体へ戻しても意味がないため） */
const AUTH_PATHS = [LOGIN_PATH, SIGNUP_PATH]

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

  return (
    <>
      {/* モバイル：アイコンからメニューを開く */}
      <BaseDropdown
        trigger={
          <Avatar className="h-8 w-8 cursor-pointer border transition-opacity border-none bg-transparent md:hidden">
            <AvatarFallback className="bg-gray-100 text-primary p-0">
              <CircleUserRound className="h-full w-full" strokeWidth={1.5} />
            </AvatarFallback>
          </Avatar>
        }
        header="ゲストさん"
        headerClassName={MENU_CLASS_NAMES.header}
        items={GuestMenuItems({ onNavigateLogin, onNavigateSignup })}
        itemClassName={MENU_CLASS_NAMES.item}
        className={MENU_CLASS_NAMES.content}
      />

      {/* md以上：ボタンを並べる */}
      <div className="hidden items-center gap-4 md:flex">
        <Button
          variant="outline"
          className="h-10 rounded-lg px-4 text-sm font-bold hover:bg-primary/15 hover:text-primary hover:border-primary/60"
          onClick={onNavigateLogin}
        >
          <LogIn className="h-4 w-4" />
          ログイン
        </Button>

        <Button
          variant="default"
          className="h-10 rounded-lg px-4 text-sm font-bold"
          onClick={onNavigateSignup}
        >
          <UserPlus className="h-4 w-4" />
          新規登録
        </Button>
      </div>
    </>
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
  const navigateToAuth = (path: string) => {
    const { pathname, search } = window.location

    const query = AUTH_PATHS.includes(pathname)
      ? ""
      : `?${REDIRECT_TO_QUERY_KEY}=${encodeURIComponent(`${pathname}${search}`)}`

    router.push(`${path}${query}`)
  }

  const handleNavigateLogin = () => navigateToAuth(LOGIN_PATH)

  const handleNavigateSignup = () => navigateToAuth(SIGNUP_PATH)

  // ログアウト処理
  const handleLogout = async () => {
    await logoutHandler()
    router.replace("/")
  }

  return (
    <header className="sticky left-0 right-0 top-0 z-50 border-b  backdrop-blur-sm transition-all">
      <div className="flex size-full items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <h1 className="text-xl font-bold text-primary md:text-3xl">
          <Link href="/">MedTrack</Link>
        </h1>

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
