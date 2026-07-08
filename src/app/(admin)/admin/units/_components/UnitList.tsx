"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Edit } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/Table/DataTable"
import { DataTableSkeleton } from "@/components/Table/DataTableSkeleton"
import { useAdminUnits } from "../_hooks/useAdminUnits"
import { UnitDialog } from "./UnitDialog"
import { fetcher } from "@/utils/fetcher"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import type { Unit, UnitFormData } from "@/types/admin/unit"


export const UnitList = () => {
  const { token } = useSupabaseSession()
  
  // 新規登録のダイアログの開閉状態
  const [isCreateOpen, setIsCreateOpen] = useState(false)  

  // 編集ダイアログの対象
  const [editTarget, setEditTarget] = useState<Unit | null>(null) 

  // 規格単位の取得
  const { units, isLoading, error, mutate } = useAdminUnits()


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
  const columns: ColumnDef<Unit>[] = [
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
      header: "規格単位", 
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

      {/* 規格単位一覧のテーブル */}
      <DataTable
        columns={columns}
        data={units}
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