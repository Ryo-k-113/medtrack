"use client"

import { AdminPageTitle } from "@/app/(admin)/admin/_components/AdminPageTitle"
import { GenericNameList } from "./_components/GenericNameList"


export default function AdminCompaniesPage() {
  return (
    <div>
      {/* ページタイトル */}
      <AdminPageTitle
        title="成分名一覧"
      />

      {/* 製薬会社一覧 */}
      <GenericNameList />
    </div>
  )
}