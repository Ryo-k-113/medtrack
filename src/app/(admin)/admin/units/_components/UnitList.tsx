"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { BaseTable } from "@/components/Table/BaseTable"
import { DataTableSkeleton } from "@/components/Table/DataTableSkeleton"
import { SearchBox } from "@/components/Form/SearchBox"
import { PaginationControl } from "@/components/Pagination/PaginationControl"
import { PaginationPageSize } from "@/components/Pagination/PaginationPageSize"
import { UnitDialog } from "./UnitDialog"
import { UnitColumns } from "./UnitColumns"
import { fetcher } from "@/utils/fetcher"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { useAdminUnits } from "../_hooks/useAdminUnits"
import type { Unit, UnitFormData } from "@/types/admin/unit"

type SearchFormData = {
  keyword: string
}

export const UnitList = () => {
  const { token } = useSupabaseSession()
  
  // 新規登録のダイアログの開閉状態
  const [isCreateOpen, setIsCreateOpen] = useState(false)  

  // 編集ダイアログの対象
  const [editTarget, setEditTarget] = useState<Unit | null>(null) 

  // 規格単位一覧の取得（ページ単位）
  const {
    units,
    page,
    pageSize,
    totalPages,
    search,
    isLoading,
    error,
    mutate,
    changePage,
    changePageSize,
    changeSearch,
  } = useAdminUnits()

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


  // 新規作成
  const handleCreate = async (data: UnitFormData) => {
    try {
      const res = await fetcher({
        url: "/api/admin/units", 
        method: "POST",
        body: data,
        token,
      })
      toast.success(res.message)
      await mutate()
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  // 編集
  const handleEdit = async (data: UnitFormData) => {
    if (!editTarget) return
    try {
      const res = await fetcher({
        url: `/api/admin/units/${editTarget.id}`,
        method: "PUT",
        body: data,
        token,
      })
      toast.success(res.message)
      await mutate()
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  // 早期リターン
  if (isLoading) return <DataTableSkeleton />
  if (error)  return <div>エラーが発生しました</div>


  // 一覧のテーブルカラム
  const columns = UnitColumns({
    onEdit: (unit) => setEditTarget(unit),
  })

  return (
    <div className="pt-8 space-y-6">

      <div className="flex justify-between">
        {/* 検索フォーム */}
        <FormProvider {...searchForm}>
          <form onSubmit={handleSearch} className="flex-1">
            <SearchBox
              name="keyword"
              placeholder="規格単位で検索"
              className="max-w-sm"
            />
          </form>
        </FormProvider>

        {/* 新規登録ボタン */}
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          新規追加
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

        {/* 規格単位一覧のテーブル */}
        <BaseTable
          columns={columns}
          data={units}
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

      {/* 新規作成ダイアログ */}
      <UnitDialog 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      {/* 編集ダイアログ */}
      {editTarget && (
        <UnitDialog
          isOpen={!!editTarget}
          onClose={() => setEditTarget(null)}
          unit={editTarget}
          onSubmit={handleEdit}
        />
      )}
    </div>
  )
}
