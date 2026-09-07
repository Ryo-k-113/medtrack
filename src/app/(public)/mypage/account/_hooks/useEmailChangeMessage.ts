"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"


/**
 * メールアドレス変更の確認リンクから戻ってきた際の通知を行うカスタムフック
 */
export const useEmailChangeMessage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const errorDescription = searchParams.get("error_description")

    if (!errorDescription) return

    toast.error("確認リンクが無効か、有効期限が切れています。")

    router.replace("/mypage/account")
  }, [searchParams, router])
}
