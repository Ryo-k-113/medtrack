"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import type { AnnounceType } from "@prisma/client"
import { TabsContent } from "@/components/ui/tabs"
import { BaseTabs } from "@/components/Tabs/BaseTabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { usePackageAnnouncements } from "@/hooks/usePackageAnnouncements"
import { PackageAnnouncementCard } from "./PackageAnnouncementCard"
import { AnnounceTypeFilter } from "./AnnounceTypeFilter"
import type { AnnouncementDateType } from "@/types/user/drug"
import { BaseCalendar } from "@/components/Calendar/BaseCalender"

// デフォルトは前日の日付
const getYesterday = () => {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date
}

// 現在は告知日のみ表示。
const ACTIVE_TAB: AnnouncementDateType = "ANNOUNCED"

export const PackageAnnouncementSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(getYesterday)

  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<AnnounceType[]>([])

  const dateParam = format(selectedDate, "yyyy-MM-dd")

  const { items, announcedCount, isLoading, error } = usePackageAnnouncements(dateParam)

  // 告知タイプによる絞り込み（未選択時は全件表示）
  const filteredItems = selectedTypes.length === 0
    ? items
    : items.filter((item) => item.announceType && selectedTypes.includes(item.announceType))


  // タブコンテンツ内の描画ロジックを if 分岐で整理
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      )
    }
    if (error) {
      return (
        <p className="py-12 text-center text-destructive">
          新着情報の取得中にエラーが発生しました
        </p>
      )
    }

    if (items.length === 0) {
      return (
        <p className="py-12 text-center text-weak">
          {format(selectedDate, "yyyy/MM/dd")}の告知情報はありません
        </p>
      )
    }

    if (filteredItems.length === 0) {
      return (
        <p className="py-12 text-center text-weak">
          選択した告知タイプに一致する情報はありません
        </p>
      )
    }

    return filteredItems.map((item) => (
      <PackageAnnouncementCard key={item.id} item={item} />
    ))
  }

  return (
    <section className="py-4 space-y-4 lg:space-y-8">
      {/* セクションタイトル */}
      <h2 className="text-xl font-bold pb-2 border-b">医薬品の更新情報</h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8">

        {/* 左側：医薬品の更新情報 */}
        <div className="lg:col-span-8 order-last lg:order-none">
          {/* 告知タイプの絞り込み */}
          <AnnounceTypeFilter
            selected={selectedTypes}
            onChange={setSelectedTypes}
            className="justify-start md:justify-end pb-4"
          />

          {/* 告知情報をタブ表示 */}
          <BaseTabs
            value={ACTIVE_TAB}
            listClassName="w-auto"
            triggerClassName="px-0"
            items={[
              { value: "ANNOUNCED", label: "告知情報", count: isLoading ? "…" : announcedCount },
            ]}
          >
            <TabsContent value={ACTIVE_TAB} className="space-y-4 pt-4">
            {renderContent()}
            </TabsContent>
          </BaseTabs>
        </div>

        {/* 右側：カレンダー */}
        <aside className="lg:col-span-4 order-first lg:order-none">

          {/* カレンダー表示(デスクトップ) */}
          <BaseCalendar
            selected={selectedDate} 
            onSelect={setSelectedDate}
            className="hidden lg:flex bg-white border rounded-lg shadow-sm p-0  w-full justify-center lg:py-6"
          />

          {/* カレンダーをpopoverで展開(モバイル) */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="surface" 
                  size="sm"
                  className="w-full max-w-[160px] justify-center  hover:bg-white lg:hidden"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {format(selectedDate, "yyyy/MM/dd", { locale: ja })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <BaseCalendar
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date)
                    setIsCalendarOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
        </aside>
      </div>        
    </section>
  )
}
