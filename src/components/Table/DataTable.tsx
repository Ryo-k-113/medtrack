"use client"
import * as React from "react"
import { useState } from "react"
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableSearchBox } from "@/components/Table/TableSearchBox"
import { TablePagination } from "@/components/Table/TablePagination"


type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
};

export const DataTable = <TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) => {
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: { globalFilter },
    initialState: { pagination: { pageSize: 50 } }, // 50件ごとの表示設定
  })

  return (
    <div>
      {/* 検索ボックス  */}
      <div className="py-6">
        <TableSearchBox
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder="検索..."
        />
      </div>
      {/* テーブル */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-primary hover:bg-primary  sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} 
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan} className="bg-primary text-primary-foreground font-bold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
              ))}
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">データがありません</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* ページネーション */}
      <TablePagination table={table} />
    </div>  
  )
}