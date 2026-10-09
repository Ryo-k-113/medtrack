"use client"
import { notFound } from "next/navigation"
import { AdminPageTitle } from "@/app/(admin)/admin/_components/AdminPageTitle"
import { DrugInfo } from "./_components/DrugInfo"
import { PackageUnitInfo } from "./_components/PackageUnitInfo"
import { AnnounceForm } from "./_components/AnnounceForm"
import { ShippingAnnouncementList } from "./_components/ShippingAnnouncementList"
import AdminPackageUnitEditLoading from "./loading"
import { useAdminPackageUnit } from "./_hooks/useAdminPackageUnit"


export default function AdminPackageUnitPage() {
  const { drugId, packageUnit, drug, isLoading } = useAdminPackageUnit()

  // ローディング画面
  if(isLoading) return <AdminPackageUnitEditLoading />
  if (!packageUnit) notFound()

  return (
    <div>
      {/* タイトルエリア */}
      <AdminPageTitle 
        title={packageUnit.name}
        // どの製品の包装か分かるよう、包装名の下に製品名を出す
        subtitle={drug?.name}
        backTo={`/admin/drugs/${drugId}`}
        backButtonText="製品詳細へ戻る"
      />

      {/* コンテンツエリア */}
      <div className="mx-auto w-full max-w-7xl pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
          {/* 左カラム */}
          <div>
            {/* 出荷告示 */}
            <AnnounceForm />
           
            {/* 告示履歴 */}
            <ShippingAnnouncementList />
          </div>

          {/* 右カラム */}
          <div className="space-y-6">
            {/* 包装情報 */}
            <PackageUnitInfo />
    
            {/* 製品情報 */}
            <DrugInfo />
          </div>
        </div>
      </div>
    </div> 
  ) 
}