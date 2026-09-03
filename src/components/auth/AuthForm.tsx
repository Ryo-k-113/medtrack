"use client"

import Link from "next/link"
import { useForm, FormProvider } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { LogIn, UserPlus } from "lucide-react"
import { FormData, authSchema } from "@/app/(public)/(auth)/_schemas/authSchema"
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton"
import { loginHandler, signupHandler } from "@/lib/supabase-auth/authHandler"
import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/Form/FormInput"
import { PasswordInput } from "@/components/Form/PasswordInput"
import { FieldDescription, FieldSeparator } from "@/components/ui/field"


type AuthFormProps = {
  formType: "signup" | "login"
  title: string
  buttonText: string
  guideText: string
  linkHref: string
  linkText: string
}

export const AuthForm = ({
  formType,
  title,
  buttonText,
  guideText,
  linkHref,
  linkText,
}: AuthFormProps) => {

  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(authSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { handleSubmit, reset, formState: { isSubmitting } } = form

  // 送信ボタンのアイコン（新規登録・ログインで切り替え）
  const SubmitIcon = formType === "signup" ? UserPlus : LogIn

  // フォーム送信（新規登録・ログインで処理を分岐）
  const onSubmit = async (formData: FormData) => {
    if (formType === "signup") {
      await signupHandler(formData, reset)
      return
    }
    await loginHandler(formData, router)
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-start  sm:justify-center">
      <div className="w-full max-w-md px-4 pt-10 sm:pt-0">
        <FormProvider {...form}>
          <div className="space-y-4 sm:space-y-8">

            {/* タイトル */}
            <h1 className="text-lg sm:text-xl font-bold">{title}</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              {/* 入力欄 */}
              <div className="space-y-6">
                <FormInput
                  name="email"
                  label="メールアドレス"
                  type="email"
                  placeholder="email@example.com"
                />

                <PasswordInput
                  name="password"
                  label="パスワード"
                  description="※英数記号を含む8文字以上"
                />
              </div>

              {/* 送信ボタン */}
              <Button
                type="submit"
                className="h-10 w-full font-bold rounded-full sm:h-12"
                disabled={isSubmitting}
              >
                <SubmitIcon className="h-4 w-4" />
                {isSubmitting ? "送信中..." : buttonText}
              </Button>
            </form>

            {/* Googleログイン */}
            <FieldSeparator className="my-0">または</FieldSeparator>
            <GoogleLoginButton className="h-10 sm:h-12"/>

            {/* ログイン・新規登録の切り替え */}
            <FieldDescription className="text-center">
              {guideText}
              <Button variant="link" asChild>
                <Link href={linkHref}>{linkText}</Link>
              </Button>
            </FieldDescription>

          </div>
        </FormProvider>
      </div>
    </div>
  )
}
