"use client"

import Link from "next/link"
import { FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductTypeTag } from "@/app/(public)/search/_components/ProductTypeTag"
import { SectionCard } from "@/components/Card/SectionCard"
import { BookmarkButton } from "@/components/Button/BookmarkButton"
import { DrugSummarySkeleton } from "./DrugSummarySkeleton"
import { usePackageDetail } from "@/hooks/usePackageDetail"

// 医薬品の区分・名称・成分名を表示する見出しエリア
export const DrugSummary = () => {
  const { drug, isLoading } = usePackageDetail()

  if (isLoading || !drug) return <DrugSummarySkeleton />

  return (
    <SectionCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ProductTypeTag type={drug.productType} />
          {drug.isSelectMedical && (
            <Badge className="rounded-md">選定療養</Badge>
          )}
        </div>

        {drug.packageInsertUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            className="px-2 py-0.5"
            asChild
          >
            <Link href={drug.packageInsertUrl} target="_blank" rel="noopener noreferrer">
              <FileText className="h-4 w-4" />
              添付文書
            </Link>
          </Button>
        )}
      </div>

      <div className="mt-1 flex items-start gap-2">
        <BookmarkButton drugId={drug.id} className="mt-1" />
        <div>
          {/* 医薬品名 */}
          <h2 className="text-lg font-bold md:text-xl">{drug.name}</h2>
          {/* 成分名 */}
          <p className="text-sm text-weak">{drug.GenericName.name}</p>
        </div>
      </div>
    </SectionCard>
  )
}
