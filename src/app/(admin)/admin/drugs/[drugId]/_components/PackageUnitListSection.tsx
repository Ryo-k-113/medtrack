"use client"
import { useAdminDrug } from "../_hooks/useAdminDrug"
import { PackageUnitAddDialog } from "./PackageUnitAddDialog"
import { PackageUnitCard } from "./PackageUnitCard"


export const PackageUnitListSection = () => {

  // 製品idと包装を取得
  const {drugId, packageUnits } = useAdminDrug()

  return (
    <div className="border p-6 rounded-md bg-background shadow-sm">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h3 className="text-xl font-bold">包装規格</h3>
      </div>

      {/*  包装カードリンク */}
      {packageUnits.map((pkg) => (
        <PackageUnitCard
          key={pkg.id}
          pkg={pkg}
          drugId={drugId}
        />
      ))}

      {/* 包装追加ボタンと新規包装登録のモーダル */}
      <PackageUnitAddDialog  />
    </div>
  )
}