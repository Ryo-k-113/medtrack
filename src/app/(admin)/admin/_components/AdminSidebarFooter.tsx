"use client"

import { LogOut, MoreVertical  } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { BaseDropdown, DropdownMenuItem } from "@/components/Dropdown/BaseDropdown"
import { SidebarFooter, useSidebar } from "@/components/ui/sidebar"
import { AdminSidebarFooterSkeleton } from "./AdminSidebarFooterSkeleton"
import { cn } from "@/lib/utils"


// サイドバーフッターのドロップダウンメニューアイテム
const SidebarFooterItems = (
  onLogout: () => void
): DropdownMenuItem[] => [
  {
    label: "ログアウト",
    icon: <LogOut className="w-4 h-4 mx-1" />,
    onClick: onLogout,
  },
]

export const AdminSidebarFooter = () => {
  const { session, isLoading } = useSupabaseSession()
  const router = useRouter()
  const { open } = useSidebar()

  const email = session?.user?.email ?? ""
  const initial = email.charAt(0).toUpperCase() 

  // ログアウト
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success("ログアウトしました")
    router.replace("/admin/login")
  }

  const items = SidebarFooterItems(handleLogout)

  // ローディング中
  if (isLoading) return <AdminSidebarFooterSkeleton />

  return (
    <SidebarFooter className="border-t p-2">
      <BaseDropdown
        className="w-[240px]"
        align="center"
        side="top"
        items={items}
        trigger={
          <div
            className={cn("flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors",
            open ? "gap-3 w-full" : "justify-center"
            )}
            
          >
            {/* アイコン */}
            <div 
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm shrink-0"
            >
              {initial}
            </div>

            {/* 開いている時のみ表示 */}
            {open && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate">{email}</p>
                  <p className="text-xs mt-0.5">管理者</p>
                </div>
                <MoreVertical className="w-4 h-4 shrink-0" />
              </>
            )}
          </div>
        }
      />
    </SidebarFooter>
  )
}