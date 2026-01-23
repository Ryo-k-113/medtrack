"use client"

import { useState } from 'react';
import Link  from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormData, authSchema } from '@/app/schemas/authSchema';
import { signupHandler, loginHandler, signInWithGoogle } from "@/lib/supabase-auth/auth";
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
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
      const signupResult = await signupHandler(formData)

      if (!signupResult.success) {
        toast.error(signupResult.message);
        return;
      }
      toast.success(signupResult.message);
      reset();

    } else {
      const loginResult = await loginHandler(formData)
      if (loginResult?.success === false) {
        toast.error(loginResult.message);
        return;
      }
    }
  }
  
  return (
    <div className="min-h-svh flex flex-col justify-center items-center">
      <div className="w-full max-w-sm">

      <FieldGroup>
          <div className="text-gray-600 text-xl text-left text-balance font-bold">
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
              disabled={isSubmitting} 
              >
              {buttonText}
            </Button>
        </Field>  
        </form>

        <FieldSeparator>または</FieldSeparator>   
        
        {/* Googleログイン */}
        <span className="sr-only">Googleでログイン</span>
        <form action={signInWithGoogle}>
          <Button 
            variant="outline" 
            type="submit"  
            className="rounded-full w-full"
            >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
                />
            </svg>
              Googleでログイン
          </Button>
        </form>

        <Field>
          <FieldDescription className="px-6 text-center">
            {guideText}
            <Button variant="ghost" className='p-2' asChild>
              <Link href={linkHref}>{linkText}</Link>
            </Button>
          </FieldDescription>
        </Field>
      </FieldGroup>
      </div>
    </div>
  )
}
