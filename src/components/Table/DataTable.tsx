"use client"
import * as React from "react"
import { useState } from "react"
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableSearchBox } from "@/components/Table/TableSearchBox"
import { TablePagination } from "@/components/Table/TablePagination"
import { cn } from "@/lib/utils"


type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  headerAction?: React.ReactNode 
  pinnedColumns?: {
    left?: string[]
    right?: string[]
  }
};

export const DataTable = <TData, TValue>({ 
  columns, 
  data, 
  headerAction,
  pinnedColumns,
 }: DataTableProps<TData, TValue>) => {
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: { globalFilter },
    initialState: { 
      pagination: { pageSize: 50 }, // 50件ごとの表示設定
      columnPinning: {  
        left: pinnedColumns?.left ?? [],  // カラムの固定 
        right: pinnedColumns?.right ?? [], 
      },
    }, 
  })

  return (
    <div>
      {/* 検索ボックス  */}
      <div className="py-10 flex justify-between">
        <TableSearchBox
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder="検索..."
        />
        {headerAction}
      </div>
      {/* テーブル */}
      <div className="rounded-md border overflow-hidden">
        <Table className="w-full table-fixed bg-white">
          <TableHeader className="bg-primary hover:bg-primary  sticky top-0 z-[1]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} 
              >
                {headerGroup.headers.map((header) => {
                  const isPinned = header.column.getIsPinned()

                  return (
                    <TableHead 
                      key={header.id} 
                      colSpan={header.colSpan}
                      style={{ 
                        width: header.getSize(),
                        position: isPinned ? "sticky" : undefined,
                        left: isPinned === "left"
                          ? `${header.column.getStart("left")}px`
                          : undefined,
                        right: isPinned === "right"
                          ? `${header.column.getAfter("right")}px`
                          : undefined,
                        zIndex: isPinned ? 20 : undefined,
                      }}
                      className="bg-primary text-primary-foreground font-bold"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
              <TableRow 
                key={row.id}
                className="group/row bg-white"
              >
                {row.getVisibleCells().map((cell) => {
                  const isPinned = cell.column.getIsPinned()

                  return (
                    <TableCell 
                      key={cell.id}
                      style={{ 
                        width: cell.column.getSize(),
                        position: isPinned ? "sticky" : undefined,
                          left: isPinned === "left"
                            ? `${cell.column.getStart("left")}px`
                            : undefined,
                          right: isPinned === "right"
                            ? `${cell.column.getAfter("right")}px`
                            : undefined,
                          zIndex: isPinned ? 10 : undefined, 
                      }}
                      className={cn(
                        "transition-colors duration-150",
                        isPinned && [
                          "bg-background",
                          "group-hover/row:bg-surface",
                        ],
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
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