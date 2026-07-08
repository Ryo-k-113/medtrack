'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AdminSidebarHeader } from './_components/AdminSidebarHeader';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar"

import { Pill, Building, FlaskConical } from 'lucide-react';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname() 
  
  // 現在のページ選択の判定
  const isSelected = (href: string) => pathname.includes(href)

  // ナビゲーションメニューアイテム
  const navItems = [
    { href: "/admin/drugs", label: "医薬品一覧", icon: Pill },
    { href: "/admin/companies", label: "製薬会社一覧", icon: Building },
    { href: "/admin/genericNames", label: "成分名一覧", icon: FlaskConical },
  ]

  return (

    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        
        {/* サイドバー  */}
        <Sidebar collapsible="icon" className="border-r border bg-surface">

          {/* サイドバーヘッダー */}
          <AdminSidebarHeader />

          {/* コンテンツ */}
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const active = isSelected(item.href)
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.label} 
                          className="w-full p-5 transition-colors"
                        >
                          <Link href={item.href} className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 shrink-0" />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex flex-col flex-1 h-full overflow-hidden">

          {/* モバイルのみ */}
          <header className="flex justify-between h-14 items-center gap-4 border-b border-border px-4 bg-background md:hidden shrink-0">
              <h1 className="font-bold text-xl text-primary">MedTrack</h1>
              <SidebarTrigger />
          </header>

          {/* メインエリア */}
          <main className="flex-1 overflow-x-auto overflow-y-auto p-6 bg-background">
            {children}
          </main>
        </div>
        
      </div>
    </SidebarProvider>
  )
}