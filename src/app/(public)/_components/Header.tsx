"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Session } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BaseDropdown } from "@/components/Dropdown/BaseDropdown"
import { UserMenuItems } from "./userMenuItems"
import { LogIn } from "lucide-react"

type AuthNavProps = {
  session: Session | null | undefined
  onNavigateMypage: () => void
  onNavigateBookmark: () => void
  onLogout: () => void
}

// ログイン状態に応じたヘッダーアイコンの表示
const AuthNav = ({ session, onNavigateMypage, onNavigateBookmark, onLogout }: AuthNavProps) => {
  if (session) {
    // メールアドレスの頭文字（アイコン表示用）
    const emailInitial = session.user.email?.charAt(0).toUpperCase() ?? "?"

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
      className="h-9 rounded-full px-4 text-sm font-bold md:h-10 md:px-6 md:text-base"
      asChild
    >
      <Link href="/login">
        <LogIn className="h-3.5 w-3.5 md:h-4 md:w-4" />
        ログイン
      </Link>
    </Button>
  )
}

export const Header = () => {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const { session, isLoading } = useSupabaseSession()

  // マイページへの遷移
  const handleNavigateMypage = () => {
    router.push("/mypage")
  }
  // マイページのブックマークへ遷移
  const handleNavigateBookmark = () => {
    router.push("/mypage/bookmarks")
  }

  // ログアウト処理
  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("ログアウトしました。")
  }

  return (
    <header className="sticky left-0 right-0 top-0 z-50 border-b  backdrop-blur-sm transition-all">
      <div className="flex size-full items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <h1 className="text-xl font-bold text-primary md:text-3xl">
          <Link href="/">MedTrack</Link>
        </h1>

        {!isLoading && (
          <AuthNav
            session={session}
            onNavigateMypage={handleNavigateMypage}
            onNavigateBookmark={handleNavigateBookmark}
            onLogout={handleLogout}
          />
        )}
      </div>
    </header>
  )
}
