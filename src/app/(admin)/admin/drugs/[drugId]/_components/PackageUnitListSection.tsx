"use client"
import { PackageUnitAddDialog } from "./PackageUnitAddDialog"
import { PackageUnitCard } from "./PackageUnitCard"
import type { DrugEditPackageUnitCard  } from "@/types/admin/drug"

type PackageUnitSectionProps = {
  packageUnits: DrugEditPackageUnitCard[]
  drugId: string
}

export const PackageUnitListSection = ({
  packageUnits,
  drugId,
}: PackageUnitSectionProps) => {
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
      <PackageUnitAddDialog drugId={drugId} />
    </div>
  )
}