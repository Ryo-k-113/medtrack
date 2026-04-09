"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { 
  Field, 
  FieldLabel, 
  FieldError, 
  FieldDescription 
} from "@/components/ui/field";



export type Option = {
  label: string;
  value: string;
};

type FormSelectBoxProps = {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  description?: string;
  className?: string;
};

export const FormSelectBox = ({
  name,
  label,
  options,
  placeholder = "選択してください",
  required = false,
  description,
  className
}: FormSelectBoxProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field 
          data-invalid={fieldState.invalid} 
          className={cn("flex flex-col gap-1", className)}
        >
          <FieldLabel htmlFor={name}>
            {label}
            {required && <span className="text-destructive">*</span>}
          </FieldLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value}
          >
            <SelectTrigger 
              id={name}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

              {/* セレクトアイテム */}
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 説明文の表示 */}
          {description && <FieldDescription>{description}</FieldDescription>}

          {/* エラーメッセージの表示 */}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}