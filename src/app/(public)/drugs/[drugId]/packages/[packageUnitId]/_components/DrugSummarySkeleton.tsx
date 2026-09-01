import { Skeleton } from "@/components/ui/skeleton"
import { SectionCard } from "@/components/Card/SectionCard"

export const DrugSummarySkeleton = () => (
  <SectionCard>
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-7 w-24" />
    </div>
    <div className="mt-1 space-y-2">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  </SectionCard>
)
