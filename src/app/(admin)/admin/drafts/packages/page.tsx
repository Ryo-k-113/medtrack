"use client"

import { AdminPageTitle } from "@/app/(admin)/admin/_components/AdminPageTitle"
import { DraftPackageUnitList } from "./_components/DraftPackageUnitList"



export default function AdminDraftPackagesPage() {
  
  return (
    <div>
      {/* ページタイトル */}
      <AdminPageTitle
        title="【下書き】包装情報一覧"
      />

      {/* 包装情報の下書き一覧 */}
      <DraftPackageUnitList />
    </div>
  )
}