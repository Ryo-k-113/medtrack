"use client"

import * as React from "react"
import { useState } from "react"
import Link from 'next/link'
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BaseTable } from "@/components/Table/BaseTable"
import { DataTableSkeleton } from "@/components/Table/DataTableSkeleton"
import { drugsColumns } from "./drugsColumns"
import { PaginationControl } from "@/components/Pagination/PaginationControl"
import { PaginationPageSize } from "@/components/Pagination/PaginationPageSize"
import { useDataFetch } from "@/hooks/useDataFetch"
import  {  GetPublishedPackageUnitsResponse  } from '@/types/admin/drug';


// デフォルトの表示件数(PaginationPageSizeの最小単位と同じ件数)
const DEFAULT_PAGE_SIZE = 10

export const DrugList = () => {

  // ページ情報と表示件数の状態管理
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  })
  const { page, pageSize } = pagination

  
  //製品と製品包装情報を取得（ページ単位）
  const { data: apiResponse, isLoading, error } = useDataFetch<GetPublishedPackageUnitsResponse>(
    `/api/admin/drugs?page=${page}&limit=${pageSize}`
  );
  const data = apiResponse?.packageUnits || [] ;
  const pageCount = Math.max(1, Math.ceil((apiResponse?.totalCount ?? 0) / pageSize))


  // ローディング表示
  if (isLoading) return <DataTableSkeleton />
  if (error) return <div>エラーが発生しました</div>

  return (
    <div className="pt-6 space-y-8">  

      <div className="flex justify-end">
        {/* 新規登録ボタン */}
        <Button variant="default" className="font-bold px-8" asChild>
          <Link href="/admin/drugs/new">
            <Plus className="h-4 w-4" />
            新規登録
          </Link>
        </Button>
      </div>

      <div className="space-y-2">

        {/* 1ページあたりの表示件数 */}
        <div className="flex justify-end"> 
          <PaginationPageSize 
            limit={pageSize}
            onLimitChange={(limit) =>
              setPagination({
                page: 1,
                pageSize:  limit,
              })
            }
          />
        </div>

        {/* 医薬品一覧テーブル */}
        <BaseTable
          columns={drugsColumns}
          data={data}
        />

        {/* ページネーション */}
        <div className="flex justify-end">
          <PaginationControl
            page={page}
            totalPages={pageCount}
            onPageChange={(newPage) =>
              setPagination((prev) => ({
                ...prev,
                page: newPage,
              }))
            }
          />
        </div>
      </div>
    </div>
  )
}
