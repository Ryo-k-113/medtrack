"use client"

import Link from 'next/link'
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BaseTable } from "@/components/Table/BaseTable"
import { DataTableSkeleton } from "@/components/Table/DataTableSkeleton"
import { drugsColumns } from "./drugsColumns"
import { PaginationControl } from "@/components/Pagination/PaginationControl"
import { PaginationPageSize } from "@/components/Pagination/PaginationPageSize"
import { useAdminDrugs } from '../_hooks/useAdminDrugs'


export const DrugList = () => {
  
  // 医薬品(包装)の一覧を取得（ページ単位）
  const {
    packageUnits,
    page,
    pageSize,
    totalPages,
    isLoading,
    error,
    changePage,
    changePageSize,
  } = useAdminDrugs() 

  // ローディング表示
  if (isLoading) return <DataTableSkeleton />
  if (error) return <div>エラーが発生しました</div>

  return (
    <div className="pt-6 space-y-8">

      <div className="flex justify-end">
        {/* 新規登録ボタン */}
        <Button variant="default" className="font-bold px-8" asChild>
          <Link href="/admin/drugs/new">
            <Plus className="h-4 w-4" />
            新規登録
          </Link>
        </Button>
      </div>

      <div className="space-y-2">

        {/* 1ページあたりの表示件数 */}
        <div className="flex justify-end">
          <PaginationPageSize
            limit={pageSize}
            onLimitChange={changePageSize}
          />
        </div>

        {/* 医薬品一覧テーブル */}
        <BaseTable
          columns={drugsColumns}
          data={packageUnits}
        />

        {/* ページネーション */}
        <div className="flex justify-end">
          <PaginationControl
            page={page}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        </div>
      </div>
    </div>
  )
}
