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
// icon
import { Eye, EyeOff } from 'lucide-react';


export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false);

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
          <div className='sm:flex gap-3'>
            <FieldLabel htmlFor="password">
              パスワード
            </FieldLabel>
            <FieldDescription className='text-gray-500'>
              ※英数記号を含む8文字以上
            </FieldDescription>
          </div>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••" 
              {...register('password')} 
              disabled={isSubmitting}
            />
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:bg-transparent'
              onClick={() => setShowPassword(prev => !prev)}
              tabIndex={-1}
              aria-label={
                showPassword
                  ? "パスワードを非表示"
                  : "パスワードを表示"
              }
            >
              {showPassword ? (<EyeOff className='w-4 h-4' />) : (<Eye className='w-4 h-4' />)}
            </Button>
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
