'use client'

import { useForm } from 'react-hook-form';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  
  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  )
}



