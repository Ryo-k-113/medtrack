'use client'

import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  
  return (
    
    <AuthForm
      formType="signup"
      title="新規登録"
      buttonText="登録する"
      guideText="アカウントをお持ちの方は"
      linkHref="/login"
      linkText="ログイン"
    />
  )
}



