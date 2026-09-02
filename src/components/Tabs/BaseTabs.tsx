"use client"

import type { ComponentProps, ReactNode } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export type BaseTabItem = {
  value: string
  label: ReactNode
  count?: number | string
}

type BaseTabsProps = ComponentProps<typeof Tabs> & {
  items: BaseTabItem[]
  listClassName?: string
  triggerClassName?: string
}

// 下線スタイルのタブ（件数表示付き）
export const BaseTabs = ({
  items,
  listClassName,
  triggerClassName,
  children,
  ...tabsProps
}: BaseTabsProps) => {
  return (
    <Tabs {...tabsProps}>
      <TabsList
        className={cn(
          "h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent p-0",
          listClassName
        )}
      >
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className={cn(
              "text-weak/60 rounded-none border-b-2 border-transparent px-1 pb-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none",
              triggerClassName
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="ml-1.5 text-xs text-weak">({item.count}件)</span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  )
}
