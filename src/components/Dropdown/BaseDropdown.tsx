
import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"


export type DropdownMenuItem = {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  className?: string
  separator?: boolean 
  disabled?: boolean  
}

type BaseDropdownProps = {
  items: DropdownMenuItem[] 
  trigger: React.ReactNode  
  disabled?: boolean
  align?: "start" | "center" | "end"
  className?: string 
}

export const BaseDropdown = ({
  items,
  trigger,
  align = "end",
}: BaseDropdownProps) => {
  return (
    <DropdownMenu>
      {/* トリガーボタン */}
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {/* セパレーターがあれば表示 */}
            {item.separator && <DropdownMenuSeparator />}
            
            {/* メニューアイテム */}
            <DropdownMenuItem
              onClick={item.onClick}
              className={cn(
                "focus:bg-surface focus:text-foreground gap-2",
                item.className,
              )}
            >
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}