"use client"
import * as React from "react"
import { useState, useEffect } from "react"
import { DataTable } from "@/components/Table/DataTable"
import { DrugPackageUnit } from "./_types/DrugPackageUnit"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

//出荷ステータス一覧
const statusMap: Record<string, string> = {
  NORMAL_SHIPMENT: "通常出荷",
  LIMITED_SHIPMENT: "限定出荷",
  SHIPMENT_SUSPENDED: "出荷停止", 
};

//一覧表示のテーブル項目
export const columns: ColumnDef<DrugPackageUnit>[] = [
  { accessorKey: "Drug.name", header: "医薬品名" },
  { accessorKey: "name", header: "包装単位" },
  { accessorKey: "currentShippingStatus", header: "出荷状況",
    cell: ({ row }) => {
      const status = row.getValue("currentShippingStatus") as string;
      const label = statusMap[status] //enumに対応するステータス表記に変換
      //statusに合わせてバッジ表示
      if (status === "NORMAL_SHIPMENT") {
        return <Badge variant="outline" className="text-status-normal-foreground border-status-normal bg-status-normal">{label}</Badge>
      }
      if (status === "LIMITED_SHIPMENT") {
        return <Badge variant="outline" className="text-status-limited-foreground border-status-limited bg-status-limited">{label}</Badge>
      }
      if (status === "SUSPENDED_SHIPMENT") {
        return <Badge variant="outline" className="text-status-stop-foreground border-status-stop bg-status-stop">{label}</Badge> 
      }
    }
  },
  { accessorKey: "gs1SalesCode", header: "販売包装用GS1コード" },
  { accessorKey: "unifiedCode", header: "統一商品コード" },
  { accessorKey: "Drug.SalesCompany.name", header: "販売会社" },
  { accessorKey: "Drug.ManufacturingCompany.name", header: "製造会社" },
  ]

export default function AdminDrugsPage() {
  const [data, setData] = useState<DrugPackageUnit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  
  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const response = await fetch('/api/admin/drugs')
        if (!response.ok) throw new Error("データの取得に失敗しました")
        const result = await response.json()
        setData(result.packageUnits)
      } catch (error) {
        console.error("エラー:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDrugs()
  }, [])
  
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
        <DataTable columns={columns} data={data} />
        )}
        </div>
    </>
    
  ) 
}