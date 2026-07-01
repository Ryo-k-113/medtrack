"use client"

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel, FieldDescription} from "@/components/ui/field"
import { cn } from "@/lib/utils";


type FormInputProps ={
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  description?: string;
  required?: boolean;
  className?: string;
}

export const FormInput = ({ 
  name, 
  label, 
  placeholder, 
  type,
  description, 
  required = false,
  className,
}: FormInputProps) => {
  const { control } = useFormContext();

  return(
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field 
          data-invalid={fieldState.invalid}
          className={cn("gap-1", className)}
        >
          <FieldLabel htmlFor={name}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FieldLabel>
          <Input 
            {...field} 
            id={name} 
            type={type || "text"} 
            placeholder={placeholder} 
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}