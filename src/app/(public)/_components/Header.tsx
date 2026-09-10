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
import { LogIn } from "lucide-react"

/** ログインページのパス */
const LOGIN_PATH = "/login"

/** 戻り先に含めないパス（認証ページ自体へ戻しても意味がないため） */
const AUTH_PATHS = [LOGIN_PATH, "/signup"]

type AuthNavProps = {
  me: CurrentUser | null
  onNavigateMypage: () => void
  onNavigateBookmark: () => void
  onNavigateLogin: () => void
  onLogout: () => void
}

// ログイン状態に応じたヘッダーアイコンの表示
const AuthNav = ({ me, onNavigateMypage, onNavigateBookmark, onNavigateLogin, onLogout }: AuthNavProps) => {
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
        items={UserMenuItems({ onNavigateBookmark,onNavigateMypage, onLogout })}
        className="p-2"
      />
    )
  }

  return (
    <Button
      variant="default"
      className="h-9 rounded-lg px-4 text-sm font-bold md:h-10 md:px-6 "
      onClick={onNavigateLogin}
    >
      <LogIn className="h-3.5 w-3.5 md:h-4 md:w-4" />
      ログイン
    </Button>
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

  // ログインページへの遷移（ログイン後に元のページへ戻れるよう現在地を渡す）
  const handleNavigateLogin = () => {
    const { pathname, search } = window.location

    const query = AUTH_PATHS.includes(pathname)
      ? ""
      : `?${REDIRECT_TO_QUERY_KEY}=${encodeURIComponent(`${pathname}${search}`)}`

    router.push(`${LOGIN_PATH}${query}`)
  }

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
            onLogout={handleLogout}
          />
        )}
      </div>
    </header>
  )
}
