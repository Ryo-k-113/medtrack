import { Skeleton } from "@/components/ui/skeleton"
import { SectionCard } from "@/components/Card/SectionCard"

export const SelectedPackageSectionSkeleton = () => (
  <SectionCard title={<Skeleton className="h-6 w-24" />} className="space-y-3">
    <Skeleton className="h-20 w-full rounded-lg" />
    <Skeleton className="h-16 w-full rounded-lg" />
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  </SectionCard>
)
