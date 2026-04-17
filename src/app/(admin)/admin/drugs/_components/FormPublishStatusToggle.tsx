"use client"

import { Controller, useFormContext } from "react-hook-form"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

type FormPublishStatusToggleProps = {
  name: string
  disabled?: boolean
  className?: string
}


export const FormPublishStatusToggle = ({
  name,
  disabled = false,
  className,
}: FormPublishStatusToggleProps) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        
        // 選択されていない状態
        const isUnselected = !field.value 

        return(
        <ToggleGroup
          type="single"
          value={field.value}
          onValueChange={(value) => {
            if (value) field.onChange(value)
          }}
          disabled={disabled}
          className={cn(
            "flex p-0.5 bg-background rounded-full border  gap-0 h-9",
            disabled && "opacity-50 pointer-events-none",
            className
          )}
        >
          <ToggleGroupItem
            value="DRAFT"
            className={cn(
              "rounded-full px-4 py-1 text-xs font-bold h-full bg-background text-foreground",
              "data-[state=on]:bg-muted/70 data-[state=on]:text-muted-foreground",
              isUnselected && "border",
              "hover:bg-transparent hover:text-foreground"
            )}
          >
            下書き
          </ToggleGroupItem>

          <ToggleGroupItem
            value="PUBLISHED"
            className={cn(
              "rounded-full px-4 py-1 text-xs font-bold h-full bg-background",
              "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
              "hover:bg-transparent hover:text-foreground"
            )}
          >
            公開
          </ToggleGroupItem>
        </ToggleGroup>
      )}}
    />
  )
  
}