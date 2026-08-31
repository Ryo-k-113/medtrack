import { LogOut, User, Bookmark } from "lucide-react"
import type { DropdownMenuItem } from "@/components/Dropdown/BaseDropdown"

type UserMenuItemsProps = {
  onNavigateMypage: () => void
  onNavigateBookmark: () => void
  onLogout: () => void
}

// ヘッダーのユーザーメニュー項目
export const UserMenuItems = ({ 
  onNavigateBookmark, 
  onNavigateMypage, 
  onLogout 
}: UserMenuItemsProps): DropdownMenuItem[] => [
  {
    label: "ブックマーク",
    icon: <Bookmark className="h-4 w-4" />,
    onClick: onNavigateBookmark,
  },
  {
    label: "マイページ",
    icon: <User className="h-4 w-4" />,
    onClick: onNavigateMypage,
  },
  {
    label: "ログアウト",
    icon: <LogOut className="h-4 w-4" />,
    onClick: onLogout,
    separator: true,
  },
]
