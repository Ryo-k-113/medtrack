import { SidebarFooter, useSidebar } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export const AdminSidebarFooterSkeleton = () => {
  const { open } = useSidebar()

  return (
    <SidebarFooter className="border-t p-2">
      <div className={cn(
        "flex items-center p-2",
        open ? "gap-3" : "justify-center"
      )}>
        {/* アバタースケルトン */}
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />

        {/* 開いている時のみ表示 */}
        {open && (
          <div className="flex-1 min-w-0 space-y-1">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-12" />
          </div>
        )}
      </div>
    </SidebarFooter>
  )
}