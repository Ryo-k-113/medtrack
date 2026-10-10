"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";


type FormCheckboxProps = {
  name: string;
  label: string;
  description?: React.ReactNode;
  className?: string; 
};

//RHFフォーム用チェックボックス
export const FormCheckbox = ({ 
  name, 
  label, 
  description,
  className
 }: FormCheckboxProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="gap-1">
          <div 
            className={cn("flex items-center space-x-3","rounded-md border px-4 py-3 bg-white",className
            )}
          >
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              className={fieldState.invalid ? "border-destructive" : ""}
            />
            <FieldLabel htmlFor={name} className="cursor-pointer">
              {label}
            </FieldLabel>
          </div>
          {/* 説明文の表示 */}
          {description && <FieldDescription className="text-xs sm:text-sm">{description}</FieldDescription>}

          {/* エラーメッセージの表示 */}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}