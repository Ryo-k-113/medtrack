"use client"

import { useState } from "react"
import { format, parse } from "date-fns"
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

/** APIとやり取りする日付の形式 */
const DATE_PARAM_FORMAT = "yyyy-MM-dd"

/** 画面に表示する日付の形式 */
const DATE_LABEL_FORMAT = "yyyy/MM/dd"

/**
 * タイトル下のガイド文言（表示中の日付）
 * @param isLatest - 日付を選んでおらず、直近の更新日を表示しているか
 */
const buildGuideText = (date: Date, isLatest: boolean) => {
  const label = format(date, DATE_LABEL_FORMAT)

  return isLatest
    ? `直近の更新日（${label}）を表示しています`
    : `${label} の更新情報を表示しています`
}

// 現在は告知日のみ表示。
const ACTIVE_TAB: AnnouncementDateType = "ANNOUNCED"

/** 初期表示するカードの件数 */
const INITIAL_DISPLAY_COUNT = 5

export const PackageAnnouncementSection = () => {
  // 日付を選ぶまで（null）は、直近の更新日を表示する
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<AnnounceType[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  // 表示対象が変わったら、展開状態を初期に戻す
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    setIsExpanded(false)
  }

  const handleChangeTypes = (types: AnnounceType[]) => {
    setSelectedTypes(types)
    setIsExpanded(false)
  }

  const dateParam = selectedDate ? format(selectedDate, DATE_PARAM_FORMAT) : null

  const { items, announcedCount, date, isLoading, error } = usePackageAnnouncements(dateParam)

  // 画面に表示する日付（未選択の間はAPIが返した直近の更新日。告知が1件もなければ今日）
  const latestDate = date ? parse(date, DATE_PARAM_FORMAT, new Date()) : null
  const displayDate = selectedDate ?? latestDate ?? (isLoading ? null : new Date())

  // 直近の更新日を表示中で、告知が1件もない場合はガイドを出さない
  const guideText =
    !isLoading && displayDate && (selectedDate || latestDate)
      ? buildGuideText(displayDate, !selectedDate)
      : null

  // 告知タイプによる絞り込み（未選択時は全件表示）
  const filteredItems = selectedTypes.length === 0
    ? items
    : items.filter((item) => item.announceType && selectedTypes.includes(item.announceType))


  // タブコンテンツ内の描画ロジックをif分岐で整理
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
          {displayDate ? `${format(displayDate, DATE_LABEL_FORMAT)}の告知情報はありません` : "告知情報はありません"}
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

    // 初期表示は先頭のみとし、残りはボタンで展開する
    const displayItems = isExpanded
      ? filteredItems
      : filteredItems.slice(0, INITIAL_DISPLAY_COUNT)

    const hiddenCount = filteredItems.length - displayItems.length

    return (
      <>
        {displayItems.map((item) => (
          <PackageAnnouncementCard key={item.id} item={item} />
        ))}

        {hiddenCount > 0 && (
          <div className="flex justify-center pt-2">
            <Button
              variant="surface"
              onClick={() => setIsExpanded(true)}
              className="w-full max-w-xs hover:bg-white hover:border-primary/60"
            >
              もっと見る（あと{hiddenCount}件）
            </Button>
          </div>
        )}
      </>
    )
  }

  return (
    <section className="py-4 space-y-4 lg:space-y-8">
      {/* セクションタイトルと、表示中の日付のガイド */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold pb-2 border-b">医薬品の更新情報</h2>
        {/* 読み込み中も高さを維持 */}
        <p className="min-h-5 text-sm text-weak">{guideText}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8">

        {/* 左側：医薬品の更新情報 */}
        <div className="lg:col-span-8 order-last lg:order-none">
          {/* 告知タイプの絞り込み */}
          <AnnounceTypeFilter
            selected={selectedTypes}
            onChange={handleChangeTypes}
            className="justify-start pb-3 mb-4 md:justify-end md:pb-0"
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
        <aside className="order-first lg:order-none lg:col-span-4 lg:sticky lg:top-24 lg:self-start">

          {/* カレンダー表示(デスクトップ)
              表示する月は最初に描画した日付で決まるため、日付が決まってから描画する */}
          {displayDate ? (
            <BaseCalendar
              selected={displayDate}
              onSelect={handleSelectDate}
              className="hidden lg:flex bg-white border rounded-lg shadow-sm p-0  w-full justify-center lg:py-6"
            />
          ) : (
            <Skeleton className="hidden h-[360px] w-full rounded-lg lg:block" />
          )}

          {/* カレンダーをpopoverで展開(モバイル) */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="surface" 
                  size="sm"
                  className="w-full max-w-[160px] justify-center  hover:bg-white lg:hidden"
                  disabled={!displayDate}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {displayDate ? format(displayDate, DATE_LABEL_FORMAT, { locale: ja }) : "読み込み中"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                {displayDate && (
                <BaseCalendar
                  selected={displayDate}
                  onSelect={(date) => {
                    handleSelectDate(date)
                    setIsCalendarOpen(false)
                  }}
                />
                )}
              </PopoverContent>
            </Popover>
        </aside>
      </div>        
    </section>
  )
}
