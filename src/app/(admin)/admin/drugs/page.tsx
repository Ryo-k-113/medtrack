"use client"
import { DrugList } from "./_components/DrugList"


export default function AdminDrugsPage() {
  return (
    <>
      {/* タイトル */}
      <div className="border-b-2">
        <h2 className="pb-2 text-xl font-bold text-foreground">
          医薬品一覧
        </h2>
      </div>
      
      {/* 医薬品一覧 */}
      <DrugList />
    </>  
  ) 
}