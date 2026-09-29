"use client"
import {
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/Logo/Logo"


export const AdminSidebarHeader = () => {
  const { open } = useSidebar()

  return (
    <SidebarHeader className={`py-4 px-3 flex flex-row items-center min-h-[60px] ${
      open ? "justify-between" : "justify-center"
    }`}>
      {open && (
        <div className="text-2xl px-2">
          <Logo />
        </div>
      )}
      <SidebarTrigger className="h-8 w-8 border border-border shrink-0" />
    </SidebarHeader>
  )
}