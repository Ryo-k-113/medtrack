"use client"
import * as React from "react"
import { useState, useEffect } from "react"
import { DataTable } from "@/components/Table/DataTable"
import { DrugPackageUnit } from "./_types/DrugPackageUnit"
import { drugsColumns } from "./_components/drugsColumns"


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
        <DataTable columns={drugsColumns} data={data} />
        )}
        </div>
    </>
    
  ) 
}