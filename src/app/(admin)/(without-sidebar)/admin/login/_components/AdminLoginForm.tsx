"use client"

import { useForm, FormProvider } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { fetcher } from "@/utils/fetcher"
import { toast } from "sonner"
import { LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/Form/FormInput"
import { PasswordInput } from "@/components/Form/PasswordInput"
import { authSchema, type AuthFormData } from "@/types/auth"


export const AdminLoginForm = () => {

  const router = useRouter()

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { handleSubmit, formState: { isSubmitting } } = form

  // フォーム送信
  const onSubmit = async (data: AuthFormData) => {
    const supabase = createClient()

    // ログイン
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      toast.error("メールアドレスまたはパスワードが正しくありません")
      return
    }

    try {
      // セッションからトークンを取得
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      if (!token) throw new Error()

      // ADMINロールチェック
      await fetcher({
        url: "/api/admin/auth/role-check",
        token, 
      })

      // 管理画面へリダイレクト
      router.replace("/admin")
      toast.success("ログインしました")

    } catch (error) {
      // サインアウト処理を実行
      await supabase.auth.signOut()
      
      if (error instanceof Error) {
        toast.error(error.message)
        return
      }
      toast.error("ログイン処理中にエラーが発生しました")
    }
  }

  return (
    <div className="h-svh flex flex-col justify-center items-center">
      <div className="w-full max-w-md -translate-y-8">
        <FormProvider {...form}>

            {/* タイトル */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-primary">MedTrack</h1>
              <p className="text-lg mt-2">
                管理者ログイン
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {/* メールアドレス */}
              <FormInput
                name="email"
                label="メールアドレス"
                type="email"
                placeholder="email@example.com"
              />

              {/* パスワード */}
              <PasswordInput
                name="password"
                label="パスワード"
              />

              {/* ログインボタン */}
              <Button
                type="submit"
                className="h-12 w-full font-bold rounded-full mt-8"
                disabled={isSubmitting}
              >   
                <LogIn className="h-4 w-4" />
                {isSubmitting ? "ログイン中..." : "ログイン"}
              </Button>
            </form>
        </FormProvider>
      </div>
    </div>
  )
}