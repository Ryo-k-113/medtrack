"use client"

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel} from "@/components/ui/field"

type FormInputProps ={
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
}

export const FormInput = ({ name, label, placeholder, type }: FormInputProps) => {
  const { control } = useFormContext();

  return(
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input 
            {...field} 
            id={name} 
            type={type || "text"} 
            placeholder={placeholder} 
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}