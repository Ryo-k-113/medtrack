import { LogOut } from "lucide-react"
import type { DropdownMenuItem } from "@/components/Dropdown/BaseDropdown"

type UserMenuItemsProps = {
  onLogout: () => void
}

// ヘッダーのユーザーメニュー項目
export const UserMenuItems = ({ onLogout }: UserMenuItemsProps): DropdownMenuItem[] => [
  {
    label: "ログアウト",
    icon: <LogOut className="h-4 w-4" />,
    onClick: onLogout,
    separator: true,
  },
]
