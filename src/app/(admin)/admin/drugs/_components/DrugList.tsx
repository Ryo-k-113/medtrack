"use client"

import { useForm, FormProvider } from "react-hook-form"
import Link from 'next/link'
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BaseTable } from "@/components/Table/BaseTable"
import { DataTableSkeleton } from "@/components/Table/DataTableSkeleton"
import { SearchBox } from "@/components/Form/SearchBox"
import { drugsColumns } from "./drugsColumns"
import { PaginationControl } from "@/components/Pagination/PaginationControl"
import { PaginationPageSize } from "@/components/Pagination/PaginationPageSize"
import { useAdminDrugs } from '../_hooks/useAdminDrugs'

type SearchFormData = {
  keyword: string
}

export const DrugList = () => {
  
  // 医薬品(包装)の一覧を取得（ページ単位）
  const {
    packageUnits,
    page,
    pageSize,
    totalPages,
    search,
    isLoading,
    error,
    changePage,
    changePageSize,
    changeSearch,
  } = useAdminDrugs()

  // 検索フォーム（検索ボタン押下時のみAPIに反映する）
  const searchForm = useForm<SearchFormData>({
    defaultValues: { 
      keyword: search 
    },
  })

  // 検索の実行
  const handleSearch = searchForm.handleSubmit(({ keyword }) => {
    changeSearch(keyword)
  })


  // ローディング表示
  if (isLoading) return <DataTableSkeleton />
  if (error) return <div>エラーが発生しました</div>

  return (
    <div className="pt-8 space-y-6">

      <div className="flex justify-between">
        {/* 検索フォーム */} 
        <FormProvider {...searchForm}>
          <form onSubmit={handleSearch} className="flex-1">
            <SearchBox 
              name="keyword" 
              placeholder="医薬品名・成分名で検索" 
              className="max-w-xs"
            />
          </form>
        </FormProvider>

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
