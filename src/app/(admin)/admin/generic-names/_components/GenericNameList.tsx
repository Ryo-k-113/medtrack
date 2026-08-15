"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Edit } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { BaseTable } from "@/components/Table/BaseTable"
import { DataTableSkeleton } from "@/components/Table/DataTableSkeleton"
import { SearchBox } from "@/components/Form/SearchBox"
import { PaginationControl } from "@/components/Pagination/PaginationControl"
import { PaginationPageSize } from "@/components/Pagination/PaginationPageSize"
import { GenericNameDialog } from "./GenericNameDialog"
import { fetcher } from "@/utils/fetcher"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { useAdminGenericNames } from "../_hooks/useAdminGenericNames"
import type { GenericName, GenericNameFormData } from "@/types/admin/genericName"

type SearchFormData = {
  keyword: string
}

export const GenericNameList = () => {

  const { token } = useSupabaseSession()

  // 新規登録のダイアログの開閉状態
  const [isCreateOpen, setIsCreateOpen] = useState(false)  

  // 編集ダイアログの対象
  const [editTarget, setEditTarget] = useState<GenericName | null>(null)

  // 成分名一覧の取得（ページ単位）
  const {
    genericNames,
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
  } = useAdminGenericNames()

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
  const handleCreate = async (data: GenericNameFormData) => {
    try {
      const res = await fetcher({
        url: "/api/admin/generic-names",
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
  const handleEdit = async (data: GenericNameFormData) => {
    if (!editTarget) return
    try {
      const res = await fetcher({
        url: `/api/admin/generic-names/${editTarget.id}`,
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
  const columns: ColumnDef<GenericName>[] = [
    {
      accessorKey: "id",
      header: "ID",
      size: 40,
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.id}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "成分名",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.name}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 100,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="h-8 w-8 md:h-9 md:w-auto md:p-4"
            onClick={() => setEditTarget(row.original)} 
          >
            <Edit className="h-4 w-4" />
            <span className="hidden md:inline ml-2 text-sm">編集する</span>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="pt-8 space-y-6">

      <div className="flex justify-between">
        {/* 検索フォーム */} 
        <FormProvider {...searchForm}>
          <form onSubmit={handleSearch} className="flex-1">
            <SearchBox
              name="keyword"
              placeholder="成分名で検索"
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

        {/* 成分名一覧のテーブル */}
        <BaseTable
          columns={columns}
          data={genericNames}
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
      <GenericNameDialog 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      {/* 編集ダイアログ */}
      {editTarget && (
        <GenericNameDialog
          isOpen={!!editTarget}
          onClose={() => setEditTarget(null)}
          genericName ={editTarget}
          onSubmit={handleEdit}
        />
      )}
    </div>
  )
}