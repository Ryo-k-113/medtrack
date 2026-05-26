"use client"
import * as React from "react"
import { DataTable } from "@/components/Table/DataTable"
import { drugsColumns } from "./_components/drugsColumns"
import { useDataFetch } from "@/hooks/useDataFetch"
import  {  GetPublishedPackageUnitsResponse  } from '@/types/admin/drug';
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Plus } from "lucide-react"

export default function AdminDrugsPage() {
  //製品と製品包装情報を取得
  const { data: apiResponse, isLoading, error } = useDataFetch<GetPublishedPackageUnitsResponse>('/api/admin/drugs');
  const data = apiResponse?.packageUnits || [] ;
  
  if (error) {
    return <div className="p-4 text-destructive">エラー: {error.message}</div>; 
  }

  return (
    <>
      {/* タイトル */}
      <div className="border-b-2">
        <h2 className="pb-2 text-xl font-bold text-foreground">
          医薬品一覧
        </h2>
      </div>
      
      {/* 医薬品一覧のテーブル */}
      {isLoading ? (
      <div className="text-center py-10">データを読み込み中...</div>
      ) : (
      <div className="px-2 py-4">
        <DataTable 
          columns={drugsColumns} 
          data={data} 
          headerAction={ 
            <Button variant="default" className="font-bold px-6" asChild>
              <Link href="/admin/drugs/new">
              <Plus className="h-4 w-4" />
                新規登録
              </Link>
            </Button>
          }
        />
      </div>
      )}
    </> 
  ) 
}