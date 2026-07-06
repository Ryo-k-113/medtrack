"use client"

import { AdminPageTitle } from "@/app/(admin)/admin/_components/AdminPageTitle"
import { CompanyList } from "./_components/CompanyList"


export default function AdminCompaniesPage() {
  return (
    <div>
      {/* ページタイトル */}
      <AdminPageTitle
        title="製薬会社一覧"
      />

      {/* 製薬会社一覧 */}
      <CompanyList />
    </div>
  )
}