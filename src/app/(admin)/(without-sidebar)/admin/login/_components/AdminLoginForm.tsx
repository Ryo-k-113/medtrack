"use client"

import { useForm, FormProvider } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { mutate as globalMutate } from "swr"
import { fetcher } from "@/utils/fetcher"
import { logoutHandler } from "@/lib/supabase-auth/logoutHandler"
import { ME_API_PATH } from "@/hooks/useMe"
import { toast } from "sonner"
import { LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/Form/FormInput"
import { PasswordInput } from "@/components/Form/PasswordInput"
import { authSchema, type AuthFormData, type CurrentUser } from "@/types/auth"


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
    try {
      // ログイン
      const currentUser: CurrentUser = await fetcher({
        url: "/api/auth/login",
        method: "POST",
        body: { ...data },
      })

      // ログイン直後の状態を反映する
      await globalMutate(ME_API_PATH, currentUser, { revalidate: false })

    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ログイン処理中にエラーが発生しました"
      )
      return
    }

    try {
      // 管理者以外はログイン状態を残さない
      await fetcher({ url: "/api/admin/auth/role-check" })

      router.replace("/admin")
      toast.success("ログインしました")

    } catch (error) {
      await logoutHandler()
      toast.error(
        error instanceof Error ? error.message : "ログイン処理中にエラーが発生しました"
      )
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