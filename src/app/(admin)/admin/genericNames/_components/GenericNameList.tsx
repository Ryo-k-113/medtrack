"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Edit } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/Table/DataTable"
import { DataTableSkeleton } from "@/components/Table/DataTableSkeleton"
import { fetcher } from "@/utils/fetcher"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { useAdminGenericNames } from "../_hooks/useAdminGenericNames"
import type { GenericName, GenericNameFormData } from "@/types/admin/genericName"


export const GenericNameList = () => {

  const { token } = useSupabaseSession()

  // 新規登録のダイアログの開閉状態
  const [isCreateOpen, setIsCreateOpen] = useState(false)  

  // 編集ダイアログの対象
  const [editTarget, setEditTarget] = useState<GenericName | null>(null) 
  
  // 成分名一覧の取得
  const { genericNames, isLoading, error, mutate } = useAdminGenericNames()


  // 新規作成
  const handleCreate = async (data: GenericNameFormData) => {
    try {
      const res = await fetcher({
        url: "/api/admin/companies",
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
        url: `/api/admin/companies/${editTarget.id}`,
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
    <div>

      {/* 成分名一覧のテーブル */}
      <DataTable
        columns={columns}
        data={genericNames}
        headerAction={
          <Button
          onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="h-4 w-4" />
            新規追加
          </Button>
        }
      />

    </div>
  )
}