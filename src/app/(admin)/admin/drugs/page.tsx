"use client"
import { AdminPageTitle } from "../_components/AdminPageTitle"
import { DrugList } from "./_components/DrugList"


export default function AdminDrugsPage() {
  return (
    <>
      {/* タイトル */}
      <AdminPageTitle 
        title="医薬品一覧"
      />
      
      {/* 医薬品一覧 */}
      <DrugList />
    </>  
  ) 
}