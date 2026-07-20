"use client"

import { useState } from "react"
import { useFormContext, Controller } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldError,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { cn } from "@/lib/utils"


type PasswordInputProps = {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  className?: string
  description?: string
}


export const PasswordInput = ({
  name,
  label,
  placeholder = "••••••••",
  required = false,
  className,
  description,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const { control, formState: { isSubmitting } } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className={cn("gap-2", className)}
        >
          <FieldLabel htmlFor={name}>
            {label}
            {required && <span className="text-destructive">*</span>}
          </FieldLabel>
          <div className="relative">
            <Input
              {...field}
              id={name}
              type={showPassword ? "text" : "password"} 
              placeholder={placeholder}
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-transparent hover:text-foreground"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "パスワードを非表示" : "パスワードを表示"}
            >
              {showPassword
                ? <EyeOff className="w-4 h-4" />
                : <Eye className="w-4 h-4" />
              }
            </Button>
          </div>

          {/* 説明文の表示 */}
          {description && (
            <FieldDescription>{description}</FieldDescription>
          )}

          {/* エラー表示 */}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}