"use client"

import { useFormContext, Controller } from "react-hook-form"
import { Search, X } from "lucide-react"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

type SearchBoxProps = {
  name:         string
  placeholder?: string
  className?:   string
  buttonClassName?: string
}

export const SearchBox = ({
  name,
  placeholder = "キーワードを入力",
  className,
  buttonClassName,
}: SearchBoxProps) => {
  const { control, setFocus } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <InputGroup className={cn("h-10 w-full overflow-hidden bg-white", className)}>
          <InputGroupInput
            {...field}
            placeholder={placeholder}
          />
          <InputGroupAddon
            align="inline-end"
            className="p-1.5" 
          >
            {/* 入力があるときだけ、文字を消すボタンを表示する */}
            {field.value ? (
              <InputGroupButton
                type="button"
                variant="surface"
                size="icon-sm"
                aria-label="入力を消去"
                // 枠線と背景を付けず、アイコンだけを表示する
                className="border-0 bg-transparent text-weak hover:bg-transparent"
                onClick={() => {
                  field.onChange("")
                  // 続けて入力できるよう、入力欄にフォーカスを戻す
                  setFocus(name)
                }}
              >
                <X className="h-4 w-4" />
              </InputGroupButton>
            ) : null}

            <InputGroupButton
              type="submit"
              variant="default"
              size="icon-sm"
              aria-label="検索"
              className={cn(
                "rounded-l-none",  
                "rounded-r-md",
                "h-10",         
                "w-10",
                buttonClassName,
              )}
            >
              <Search className="h-4 w-4" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      )}
    />
  )
}