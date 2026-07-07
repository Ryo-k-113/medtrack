"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/Table/DataTable"
import { DataTableSkeleton } from "@/components/Table/DataTableSkeleton"
import { useAdminCompanies } from "../_hooks/useAdminCompanies"
import type { Company } from "@/types/admin/company"
import { CompanyDialog } from "./CompanyDialog"
import { fetcher } from "@/utils/fetcher"
import {type CompanyFormData } from "../_schemas/company"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { toast } from "sonner"

export const CompanyList = () => {
  const { token } = useSupabaseSession()
  
  // 新規登録のダイアログの開閉状態
  const [isCreateOpen, setIsCreateOpen] = useState(false)  

   // 編集ダイアログの対象
   const [editTarget, setEditTarget] = useState<Company | null>(null) 


  const { companies, isLoading, error, mutate } = useAdminCompanies()


   // 新規作成
   const handleCreate = async (data: CompanyFormData) => {
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
  const handleEdit = async (data: CompanyFormData) => {
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
  const columns: ColumnDef<Company>[] = [
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
      header: "会社名",
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

      {/* 製薬会社一覧のテーブル */}
      <DataTable
        columns={columns}
        data={companies}
        headerAction={
          <Button
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="h-4 w-4" />
            新規追加
          </Button>
        }
      />

      {/* 新規作成ダイアログ */}
      <CompanyDialog 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      {/* 編集ダイアログ */}
      {editTarget && (
        <CompanyDialog
          isOpen={!!editTarget}
          onClose={() => setEditTarget(null)}
          company={editTarget}
          onSubmit={handleEdit}
        />
      )}

    </div>
  )
}