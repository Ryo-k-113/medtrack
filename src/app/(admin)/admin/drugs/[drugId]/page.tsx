"use client"
import * as React from "react"
import { DrugEditForm } from "./_components/DrugEditForm"
import { AdminPageTitle } from "../../_components/AdminPageTitle"
import { useAdminDrug } from "./_hooks/useAdminDrug"
import AdminDrugEditLoading from "./loading"
import { notFound } from "next/navigation"
import { PackageUnitListSection } from "./_components/PackageUnitListSection"


export default function AdminDrugEditPage() {
  
  // 製品情報を取得
  const { drug, isDrugLoading:isLoading } = useAdminDrug()

  // ローディング画面
  if (isLoading) return <AdminDrugEditLoading />
  if (!drug) notFound()

  return (
    <div>
      {/* タイトルと戻るボタン */}
      <AdminPageTitle
        title={drug?.name}
        backTo="/admin/drugs"
        backButtonText="一覧へ戻る"
      />

      {/* 医薬品の編集フォーム */}
      <DrugEditForm />
      
      {/* 包装一覧 */}
      <PackageUnitListSection />
    </div> 
  ) 

}
