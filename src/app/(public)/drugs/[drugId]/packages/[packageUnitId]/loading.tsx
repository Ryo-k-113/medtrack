import { DrugSummarySkeleton } from "./_components/DrugSummarySkeleton"
import { SelectedPackageSectionSkeleton } from "./_components/SelectedPackageSectionSkeleton"
import { DrugInfoSectionSkeleton } from "./_components/DrugInfoSectionSkeleton"
import { OtherPackageListSkeleton } from "./_components/OtherPackageListSkeleton"
import { PackageAnnounceHistorySkeleton } from "./_components/PackageAnnounceHistorySkeleton"

export default function PackageDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-6 md:py-10">
      <DrugSummarySkeleton />
      <SelectedPackageSectionSkeleton />
      <DrugInfoSectionSkeleton />
      <OtherPackageListSkeleton />
      <PackageAnnounceHistorySkeleton />
    </div>
  )
}
