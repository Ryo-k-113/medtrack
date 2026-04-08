"use client"

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel, FieldDescription} from "@/components/ui/field"

type FormInputProps ={
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  description?: string;
  required?: boolean;
}

export const FormInput = ({ 
  name, 
  label, 
  placeholder, 
  type,
  description, 
  required = false
}: FormInputProps) => {
  const { control } = useFormContext();

  return(
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field 
          data-invalid={fieldState.invalid}
          className="gap-1"
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