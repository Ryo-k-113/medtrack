"use client"
import * as React from "react"
import { useParams } from "next/navigation"
import { useDataFetch } from "@/hooks/useDataFetch"
import { DrugEditForm } from "./_components/DrugEditForm"
import { AdminPageTitle } from "../../_components/AdminPageTitle"

export default function AdminDrugEditPage() {
  const params = useParams()
  const drugId = params.drugId as string

  const { data: drugData, isLoading } = useDataFetch(`/api/admin/drugs/${drugId}`)
  const drugName = drugData?.data?.name

  return (
    <div>
      {/* タイトルと戻るボタン */}
      <AdminPageTitle 
        title={isLoading ? "読み込み中..." : `${drugName} を編集`}
        backTo="/admin/drugs"
        backButtonText="一覧へ戻る"
      />

      {/* 医薬品の編集フォーム */}
      <DrugEditForm />
    </div> 
  ) 

}
