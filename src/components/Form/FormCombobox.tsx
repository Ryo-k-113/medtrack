"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { SelectOption } from "@/types/ui/select";


type FormComboboxProps = {
  name: string;
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
  required?: boolean;
  className?: string;
};


export const FormCombobox = ({
  name,
  label,
  placeholder = "選択してください",
  className,
  required = false,
  options,
}: FormComboboxProps) => {
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
          <Combobox
            items={options}
            value={options.find((opt) => opt.value === field.value) ?? null}
            onValueChange={(item) => field.onChange(item?.value ?? "")}
          >
            <ComboboxInput
              id={name}
              placeholder={placeholder}
              showClear={false}
              showTrigger={true}
              className={cn(
                "w-full bg-background text-foreground",
                fieldState.invalid && "border-destructive text-destructive"
              )}
            />

            <ComboboxContent
              className="w-full"
              style={{ width: "var(--positioner-anchor-width, 100%)" }}
            >
              <ComboboxEmpty>項目が見つかりません</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem 
                    key={item.value} 
                    value={item}
                    className="hover:bg-surface hover:text-foreground cursor-pointer"
                  >
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {/* エラー表示 */}
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
}