"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react" 
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type FormDatePickerProps = {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
};

export function FormDatePicker({ 
  name, 
  label, 
  placeholder = "日付を選択" ,
  className,
  required = false,
}: FormDatePickerProps) {
  const { control } = useFormContext();
  const [isOpen, setIsOpen] = useState(false)

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
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                id={name}
                variant={"surface"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !field.value && "text-placeholder",
                  fieldState.invalid && "border-destructive text-destructive"
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                {field.value ? (
                  format(field.value, "PPP", { locale: ja })
                ) : (
                  <span>{placeholder}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date)
                  setIsOpen(false)
                  }
                } 
                disabled={(date) => date < new Date("1900-01-01")}
                locale={ja}
              />
            </PopoverContent>
          </Popover>
          {fieldState.invalid && 
            <FieldError errors={[fieldState.error]} />
          }
        </Field>
      )}
    />
  );
}


