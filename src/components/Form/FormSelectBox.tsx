"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { SelectOption } from "@/types/ui/select"


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



type FormSelectBoxProps<T extends string> = {
  name: string;
  label: string;
  options: readonly SelectOption<T>[];
  placeholder?: string;
  required?: boolean;
  description?: string;
  /** 選択肢ごとの配色（選択肢と、選択後の入力欄に付ける。告示種別の色分けなど） */
  optionClassNames?: Partial<Record<T, string>>;
  className?: string;
};

export const FormSelectBox = <T extends string> ({
  name,
  label,
  options = [],
  placeholder = "選択してください",
  required = false,
  description,
  optionClassNames,
  className
}: FormSelectBoxProps<T>) => {
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
            key={field.value} 
            onValueChange={field.onChange} 
            value={field.value}
          >
            <SelectTrigger
              id={name}
              // 選択済みの値に配色があれば、入力欄にも同じ色を付ける
              className={cn(optionClassNames?.[field.value as T])}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

              {/* セレクトアイテム */}
            <SelectContent position="popper">
              {options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  // 配色がある選択肢は、隣と色が繋がらないよう枠と間隔を付ける
                  className={cn(optionClassNames?.[opt.value] && ["my-1 border", optionClassNames[opt.value]])}
                >
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