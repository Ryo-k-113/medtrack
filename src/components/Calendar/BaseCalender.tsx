"use client"

import { ja } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

type BaseCalendarProps = {
  selected: Date
  onSelect: (date: Date) => void
  className?: string
}

// 年・月をドロップダウンで直接選択できるカレンダー
export const BaseCalendar = ({ selected, onSelect, className }: BaseCalendarProps) => {
  return (
    <Calendar
      mode="single"
      required
      selected={selected}
      onSelect={onSelect}
      locale={ja}
      captionLayout="dropdown"
      className={cn("mx-auto [--cell-size:2.5rem]", className)}
      classNames={{
        dropdown_root: "has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md",
      }}
    />
  )
}
