"use client"

import { PackageStatusCard } from "./PackageStatusCard"
import { SectionCard } from "@/components/Card/SectionCard"
import { OtherPackageListSkeleton } from "./OtherPackageListSkeleton"
import { usePackageDetail } from "@/hooks/usePackageDetail"

// 同一製品の包装形態一覧
export const OtherPackageList = () => {
  const { drug, packageUnit, packageUnits, isLoading } = usePackageDetail()

  if (isLoading || !drug || !packageUnit || !packageUnits) return <OtherPackageListSkeleton />

  const otherPackageUnits = packageUnits.filter((pkg) => pkg.id !== packageUnit.id)

  if (otherPackageUnits.length === 0) return null

  return (
    <SectionCard title="他の包装形態">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {otherPackageUnits.map((pkg) => (
          <PackageStatusCard
            key={pkg.id}
            name={pkg.name}
            status={pkg.currentShippingStatus}
            href={`/drugs/${drug.id}/packages/${pkg.id}`}
          />
        ))}
      </div>
    </SectionCard>
  )
}
