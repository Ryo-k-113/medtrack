import { Skeleton } from "@/components/ui/skeleton"
import { SectionCard } from "@/components/Card/SectionCard"

export const PackageAnnounceHistorySkeleton = () => (
  <SectionCard title={<Skeleton className="h-6 w-24" />}>
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  </SectionCard>
)
