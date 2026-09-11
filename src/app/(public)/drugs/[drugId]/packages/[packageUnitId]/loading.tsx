import { PageContainer } from "@/components/Layout/PageContainer"
import { DrugSummarySkeleton } from "./_components/DrugSummarySkeleton"
import { SelectedPackageSectionSkeleton } from "./_components/SelectedPackageSectionSkeleton"
import { DrugInfoSectionSkeleton } from "./_components/DrugInfoSectionSkeleton"
import { OtherPackageListSkeleton } from "./_components/OtherPackageListSkeleton"
import { PackageShippingAnnouncementsSkeleton } from "./_components/PackageShippingAnnouncementsSkeleton"

export default function PackageDetailLoading() {
  return (
    <PageContainer className="space-y-6">
      <DrugSummarySkeleton />
      <SelectedPackageSectionSkeleton />
      <DrugInfoSectionSkeleton />
      <OtherPackageListSkeleton />
      <PackageShippingAnnouncementsSkeleton />
    </PageContainer>
  )
}
