"use client"

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { mutate as globalMutate } from "swr";
import { toast } from "sonner";
import { fetcher } from "@/utils/fetcher";
import { ME_API_PATH } from "@/hooks/useMe";
import { REDIRECT_TO_QUERY_KEY, resolveRedirectPath } from "@/constants/auth";
import type { AuthFormData, CurrentUser } from "@/types/auth";

/**
 * ログイン
 * 認証とセッションのCookie発行はサーバー側で行う
 */
export const loginHandler = async (
  formData: AuthFormData,
  router: AppRouterInstance
) => {
  try {
    const currentUser: CurrentUser = await fetcher({
      url: "/api/auth/login",
      method: "POST",
      body: { ...formData },
    })

    // ログイン直後の状態を反映する
    await globalMutate(ME_API_PATH, currentUser, { revalidate: false })

    // ミドルウェアが付与した戻り先へ遷移する
    const redirectPath = resolveRedirectPath(
      new URLSearchParams(window.location.search).get(REDIRECT_TO_QUERY_KEY)
    )

    router.replace(redirectPath)
    toast.success("ログインに成功しました。")

  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "エラーが発生しました"
    )
  }
}

/**
 * 新規登録
 * 確認メールのリンクを開くまでログインは完了しない
 */
export const signupHandler = async (formData: AuthFormData, reset: () => void) => {
  try {
    const result = await fetcher({
      url: "/api/auth/signup",
      method: "POST",
      body: { ...formData },
    })

    toast.success(result.message)
    reset()

  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "処理中にエラーが発生しました。"
    )
  }
}
