"use client"
import * as React from "react"
import { DrugEditForm } from "./_components/DrugEditForm"
import { AdminPageTitle } from "../../_components/AdminPageTitle"
import { useAdminDrug } from "./_hooks/useAdminDrug"


export default function AdminDrugEditPage() {
  
  // 製品情報を取得
  const { drug, isDrugLoading:isLoading } = useAdminDrug()
  const drugName = drug?.name

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
