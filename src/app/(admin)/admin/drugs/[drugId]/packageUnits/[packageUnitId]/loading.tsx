" use client"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminPackageUnitEditLoading() {
  return (
    <div>
      {/* ページヘッダー */}
      <div className="flex items-center justify-between py-5 border-b">
        <Skeleton className="h-8 w-48" /> 
      </div>

      <div className="mx-auto w-full max-w-7xl pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
        
          {/* 左カラムの Skeleton */}
          <div className="space-y-4">
            <div className="border rounded-xl p-6  space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>
          
            {/* 告示履歴 */}
            <div className="border rounded-xl p-6 space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" /> 
                <Skeleton className="h-8 w-full" /> 
                <Skeleton className="h-8 w-full" /> 
              </div> 
            </div>
          </div>

          {/* 右カラム */}
          <div className="space-y-6">
            {/* 包装情報のカード */}
            <div className="border rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20" /> 
              </div>
              <div className="space-y-3 pt-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                ))}
              </div>
            </div>
    
            {/* 製品情報のカード */}
            <div className="border rounded-xl p-6 space-y-4">
              <Skeleton className="h-6 w-20" /> 
              <div className="space-y-3 pt-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div> 
  ) 
}