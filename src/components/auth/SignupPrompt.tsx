"use client"

import { forwardRef, type ComponentPropsWithoutRef } from "react"
import { Check, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton"
import { useAuthNavigation } from "@/hooks/useAuthNavigation"
import { cn } from "@/lib/utils"

/** 登録後に使える機能(案内に表示) */
const MEMBER_BENEFITS = [
  "複数の医薬品をまとめて検索（最大3件）",
  "ブックマークした医薬品の出荷状況をまとめて確認",
]

type SignupPromptTitleProps = {
  title: string
  className?: string
}

/**
 * 案内の見出し（鍵のアイコン＋文言）
 * ダイアログでは DialogTitle の中に置くため、見出しの中に入れられる span で作る
 * （DialogTitle の既定の文字の大きさ・字間を受け継がないよう、ここで指定しきる）
 */
export const SignupPromptTitle = ({ title, className }: SignupPromptTitleProps) => (
  <span className={cn("flex items-center gap-2 text-base font-bold tracking-normal md:text-lg", className)}>
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Lock className="h-4 w-4" aria-hidden="true" />
    </span>
    {title}
  </span>
)

/**
 * 登録後に使える機能の一覧
 */
export const SignupPromptBenefits = forwardRef<HTMLUListElement, ComponentPropsWithoutRef<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("space-y-1.5", className)} {...props}>
      {MEMBER_BENEFITS.map((benefit) => (
        <li key={benefit} className="flex items-start gap-1.5 text-sm text-weak">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          {benefit}
        </li>
      ))}
    </ul>
  )
)
SignupPromptBenefits.displayName = "SignupPromptBenefits"

/**
 * 登録ボタンとログインへの案内
 * 登録・ログイン後は現在のページへ戻る
 */
export const SignupPromptActions = () => {
  const { navigateToSignup, navigateToLogin } = useAuthNavigation()

  return (
    <div className="space-y-4">
      {/* 機能一覧との間は、並べる側の余白に padding を足して広げる */}
      <div className="grid gap-3 md:gap-4 md:pt-4">
        {/* Googleログイン */}
        <GoogleLoginButton
          label="Googleで無料登録"
          redirectToCurrentPage
          className="h-11 border-foreground/20 font-bold"
        />

        {/* 新規登録ページへ */}
        <Button
          type="button"
          variant="accent"
          onClick={navigateToSignup}
          className="h-11 w-full rounded-full font-bold"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          メールアドレスで無料登録
        </Button>
      </div>

      <p className="text-center text-sm text-weak md:pt-2">
        アカウントをお持ちの方は
        <Button type="button" variant="link" onClick={navigateToLogin} className="h-auto px-1 py-0">
          ログイン
        </Button>
      </p>
    </div>
  )
}

type SignupPromptProps = {
  title: string
  className?: string
}

/**
 * 無料登録の案内（ページ内に置く用）
 * 登録後の解放機能の表示と登録・ログイン画面への動線
 * ダイアログで出す場合は SignupPromptDialog を使う
 */
export const SignupPrompt = ({ title, className }: SignupPromptProps) => (
  <div className={className}>
    {/* デスクトップでは左右に余白を取って1本の列にし、見出し・機能・ボタンの始まりをそろえる
        （className の padding と重ならないよう内側で付ける） */}
    <div className="space-y-4 md:px-10">
      {/* 鍵のアイコンだけ左の余白へはみ出させる */}
      <SignupPromptTitle title={title} className="md:-ml-10" />
      <SignupPromptBenefits />
      <SignupPromptActions />
    </div>
  </div>
)
