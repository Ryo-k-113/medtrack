"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/Table/DataTable"
import { DataTableSkeleton } from "@/components/Table/DataTableSkeleton"
import { useAdminCompanies } from "../_hooks/useAdminCompanies"
import type { Company } from "@/types/admin/company"
import { CompanyCreateDialog } from "./CompanyCreateDialog"


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
        >
          <Edit className="h-4 w-4" />
          <span className="hidden md:inline ml-2 text-sm">編集する</span>
        </Button>
      </div>
    ),
  },
]

export const CompanyList = () => {
  
  // 新規登録のダイアログの開閉状態
  const [isCreateOpen, setIsCreateOpen] = useState(false)   

  const { companies, isLoading, error } = useAdminCompanies()
 
  // 早期リターン
  if (isLoading) return <DataTableSkeleton />
  if (error)  return <div>エラーが発生しました</div>

  return (
    <div>
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
      <CompanyCreateDialog 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  )
}
