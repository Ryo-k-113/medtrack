"use client"

import Link from "next/link"
import { ExternalLink, FileText } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { usePackageDetail } from "@/hooks/usePackageDetail"
import { buildPackageInsertUrl } from "@/utils/packageInsert"

// 添付文書・インタビューフォームへのリンク（PMDAの該当ページを開く）
export const PackageInsertLinkCard = () => {
  const { drug, isLoading } = usePackageDetail()

  // ローディング中のスケルトン表示
  if (isLoading || !drug) return <Skeleton className="h-[76px] w-full rounded-xl md:h-[88px] md:rounded-2xl" />

  const packageInsertUrl = buildPackageInsertUrl(drug.yjCode)
  if (!packageInsertUrl) return null

  return (
    <Link
      href={packageInsertUrl}
      target="_blank"
      rel="noopener noreferrer"
      // 1段目：アイコン・見出し・外部リンクアイコン、2段目：見出しの下に説明
      className="group grid grid-cols-[auto_1fr_auto] items-start gap-x-2 gap-y-0.5 rounded-xl border bg-background px-3 py-4 shadow-sm transition-colors hover:border-primary hover:bg-primary/5 md:rounded-2xl md:px-6 md:items-center"
    >
      {/* ファイルのアイコン */}
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary md:h-8 md:w-8">
        <FileText className="h-4 w-4 md:h-5 md:w-5" />
      </div>
      
      {/* 見出し */}
      <p className="text-sm font-bold group-hover:text-primary md:text-base">
        添付文書・インタビューフォーム
      </p>

      {/* 外部リンクのアイコン */}
      <ExternalLink
        className="h-4 w-4 text-weak transition-colors group-hover:text-primary md:h-5 md:w-5"
        aria-hidden="true"
      />

      {/* 説明文 */}
      <p className="col-start-2 col-end-4 text-xs text-weak md:text-sm">
        PMDA（医薬品医療機器総合機構）のページが開きます
      </p>
    </Link>
  )
}
