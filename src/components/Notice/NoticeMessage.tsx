"use client"

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { NOTICE, NOTICE_QUERY_KEY, isNoticeKey } from "@/constants/notice"

/**
 * 確認リンクから戻った際の通知
 * 通知後はクエリを取り除き、再読み込みで繰り返し表示されないようにする
 */
export const NoticeMessage = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const key = searchParams.get(NOTICE_QUERY_KEY)

    if (!key || !isNoticeKey(key)) return

    const { type, message } = NOTICE[key]

    toast[type](message)

    router.replace(pathname)
  }, [searchParams, pathname, router])

  return null
}
