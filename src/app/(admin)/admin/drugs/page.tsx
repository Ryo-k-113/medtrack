"use client"
import { AdminPageTitle } from "../_components/AdminPageTitle"
import { DrugList } from "./_components/DrugList"
import { Suspense } from "react"
import { DataTableSkeleton } from "@/components/Table/DataTableSkeleton"


export default function AdminDrugsPage() {
  return (
    <>
      {/* タイトル */}
      <AdminPageTitle 
        title="医薬品一覧"
      />
      
      {/* 医薬品一覧 */}
      <Suspense fallback={<DataTableSkeleton />}>
        <DrugList />
      </Suspense>
    </>  
  ) 
}