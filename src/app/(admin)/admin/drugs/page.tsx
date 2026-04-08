"use client"
import * as React from "react"
import { DataTable } from "@/components/Table/DataTable"
// import { DrugPackageUnit } from "./_types/DrugPackageUnit"
import { drugsColumns } from "./_components/drugsColumns"
import { useDataFetch } from "@/hooks/useDataFetch"
import  {  GetPublishedPackageUnitsResponse  } from '@/types/admin/drug';

// type DrugsApiResponse = {
//   packageUnits: DrugPackageUnit[];
// };

export default function AdminDrugsPage() {
  //製品と製品包装情報を取得
  const { data: apiResponse, isLoading, error } = useDataFetch<GetPublishedPackageUnitsResponse>('/api/admin/drugs');
  const data = apiResponse?.packageUnits || [] ;
  
  if (error) {
    return <div className="p-4 text-destructive">エラー: {error.message}</div>; 
  }

  return (
    <>
      <div className="border-b-2">
        <h2 className="pb-2 text-xl font-bold text-foreground">
          医薬品一覧
        </h2>
      </div>
      <div className="p-4">
        {isLoading ? (
        <div className="text-center py-10">データを読み込み中...</div>
        ) : (
        <DataTable columns={drugsColumns} data={data} />
        )}
      </div>
    </>
    
  ) 
}