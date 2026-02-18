"use client"

import { useState } from 'react';
import Link  from "next/link";
import { useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";
import { zodResolver } from '@hookform/resolvers/zod';
import { FormData, authSchema } from '@/app/(public)/(auth)/_schemas/authSchema';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { loginHandler, signupHandler } from "@/lib/supabase-auth/authHandler";
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

type AuthFormProps = {
  formType: "signup" | "login";
  title: string;
  buttonText: string;
  guideText: string;
  linkHref: string;
  linkText: string;
};

export const AuthForm = ({
  formType,
  title,
  buttonText,
  guideText,
  linkHref,
  linkText,
}: AuthFormProps)  => {
  
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(authSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  
  // 送信
  const onSubmit = async (formData: FormData ) => {
  
    if (formType === "signup") {
      await signupHandler(formData, reset);
    } else {
      await loginHandler(formData, router)
    }
  }
  
  return (
    <div className="min-h-svh flex flex-col justify-center items-center">
      <div className="w-full max-w-sm">

      <FieldGroup>
          <div className="text-foreground text-xl text-left text-balance font-bold">
            {title}
          </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
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
              <p className="text-sm text-destructive">
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
                <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </Field>
        
          <Field>
            <Button 
              variant="default"
              type="submit" 
              className="font-bold rounded-full"
              disabled={isSubmitting} 
              >
              {buttonText}
            </Button>
        </Field>  
        </form>

        <FieldSeparator>または</FieldSeparator>   
        
        {/* Googleログイン */}
        <span className="sr-only">Googleでログイン</span>
        <GoogleLoginButton />

        <Field>
          <FieldDescription className="px-6 text-center">
            {guideText}
            <Button variant="link" className='p-2' asChild>
              <Link href={linkHref}>{linkText}</Link>
            </Button>
          </FieldDescription>
        </Field>
      </FieldGroup>
      </div>
    </div>
  )
}
