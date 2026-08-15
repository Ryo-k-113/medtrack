"use client"

import { useFormContext, Controller } from "react-hook-form"
import { Search } from "lucide-react"
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
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <InputGroup className={cn("h-10 w-full overflow-hidden", className)}>
          <InputGroupInput
            {...field}
            placeholder={placeholder}
          />
          <InputGroupAddon
            align="inline-end"
            className="p-1" 
          >
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