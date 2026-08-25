"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"


type BaseTableProps<TData> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns:       ColumnDef<TData, any>[]
  data:          TData[]
  pinnedColumns?: {
    left?:  string[]
    right?: string[]
  }
  emptyContent?: React.ReactNode
  headerClassName?: string
  className?: string
}

export const BaseTable = <TData,>({
  columns,
  data,
  pinnedColumns,
  emptyContent = "データがありません",
  headerClassName,
  className,
}: BaseTableProps<TData>) => {

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnPinning: {
        left:  pinnedColumns?.left  ?? [],
        right: pinnedColumns?.right ?? [],
      },
    },
  })

  return (
    <div className={cn("rounded-md border overflow-hidden", className)}>
      <Table className="w-full table-fixed bg-white">

        {/* ヘッダー */}
        <TableHeader className={cn(
            "bg-primary text-primary-foreground hover:bg-primary sticky top-0 z-[1]",
            headerClassName
          )}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
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
                        ? `${header.column.getStart("left")}px` : undefined,
                      right: isPinned === "right"
                        ? `${header.column.getAfter("right")}px`
                        : undefined,
                      zIndex: isPinned ? 20 : undefined,
                    }}
                    className="bg-primary text-primary-foreground font-bold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())
                    }
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        {/* ボディ */}
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

            // データが空の時の表示
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                {emptyContent}
              </TableCell>
            </TableRow>
          )}
        </TableBody>

      </Table>
    </div>
  )
}