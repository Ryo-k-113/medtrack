'use client'

import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  
  return (
    <AuthForm 
      formType="login"
      title="ログイン"
      buttonText="ログインする"
      guideText="アカウントをお持ちでない方は"
      linkHref="/signup"
      linkText="新規登録"
    />
)
}