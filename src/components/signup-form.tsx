"use client"

import { useState } from 'react';
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/utils/supabase'
import { signupSchema, SignupFormValues } from '@/app/schemas/signupFormSchema';
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


export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
 
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 送信
  const onSubmit = async (data: SignupFormValues) => {
    const { email, password } = data;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `http://localhost:3000/login`,
      },
    })
    if (error) {
      alert('登録に失敗しました')
    } else {
      reset();
      alert('確認メールを送信しました。')
    }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col  gap-1 text-left">
          <h1 className="text-3xl font-bold text-blue-700">MedTrack</h1>
          <p className="text-gray-600 text-xl text-balance font-bold">
            新規登録
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">メールアドレス</FieldLabel>
          <Input 
            id="email"  
            type="email" 
            placeholder="email@example.com"  
            {...register('email')} 
            disabled={isSubmitting} 
          />
          {errors.email && (
            <p className="text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">パスワード</FieldLabel>
          <div>
            <Input 
              id="password" 
              type="password"
              placeholder="••••••••" 
              {...register('password')} 
              disabled={isSubmitting}
            />
          </div>
            {errors.password && (
            <p className="text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </Field>
        
        <Field>
          <Button 
            type="submit" 
            className="font-bold bg-blue-700 rounded-full hover:bg-blue-500"
          >
            登録する
          </Button>
        </Field>

        <Field>
          <FieldDescription className="px-6 text-center">
            すでにアカウントをお持ちの方は 
            <Button variant="ghost" className='p-2' asChild>
              <Link href="#">ログイン</Link>
            </Button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
