"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"


interface TablePaginationProps<TData> {
  table: Table<TData>
}

export const TablePagination = ({ table }: TablePaginationProps<TData>) => {

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>前へ</Button>
      <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>次へ</Button>
    </div>
  )
}