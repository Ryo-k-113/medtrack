"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"


export const AdminSidebarHeader = () => {
  const { open } = useSidebar()

  return (
    <SidebarHeader className={`py-4 px-3 flex flex-row items-center min-h-[60px] ${
      open ? "justify-between" : "justify-center"
    }`}>
      {open && (
        <div className="font-bold text-primary text-2xl px-2">
          MedTrack
        </div>
      )}
      <SidebarTrigger className="h-8 w-8 border border-border shrink-0" />
    </SidebarHeader>
  )
}