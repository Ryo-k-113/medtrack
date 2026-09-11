import { LogIn, UserPlus } from "lucide-react"
import type { DropdownMenuItem } from "@/components/Dropdown/BaseDropdown"

type GuestMenuItemsProps = {
  onNavigateLogin: () => void
  onNavigateSignup: () => void
}

// ヘッダーの未ログイン時のメニュー項目
export const GuestMenuItems = ({
  onNavigateLogin,
  onNavigateSignup,
}: GuestMenuItemsProps): DropdownMenuItem[] => [
  {
    label: "ログイン",
    icon: <LogIn className="h-4 w-4" />,
    onClick: onNavigateLogin,
  },
  {
    label: "新規登録",
    icon: <UserPlus className="h-4 w-4" />,
    onClick: onNavigateSignup,
  },
]
