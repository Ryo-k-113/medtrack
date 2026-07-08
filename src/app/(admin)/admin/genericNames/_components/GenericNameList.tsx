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
import type { GenericName } from "@/types/admin/genericName"


export const GenericNameList = () => {

  const { token } = useSupabaseSession()

  
  const { genericNames, isLoading, error, mutate } = useAdminGenericNames()


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
           
          >
            <Plus className="h-4 w-4" />
            新規追加
          </Button>
        }
      />

    </div>
  )
}