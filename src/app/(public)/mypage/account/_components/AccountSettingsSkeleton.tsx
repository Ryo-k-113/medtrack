import { Skeleton } from "@/components/ui/skeleton"

/** ローディング中に表示するアカウント設定のスケルトンコンポーネント */
export const AccountSettingsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* ログイン方法（Googleログイン・メールアドレスログイン） */}
      {[...Array(2)].map((_, i) => (
        <div key={i} className="space-y-2 border-b pb-6">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-9 w-16" />
          </div>
          <Skeleton className="h-5 w-56" />
        </div>
      ))}

      {/* パスワード変更 */}
      <div className="space-y-6">
        <Skeleton className="h-5 w-28" />

        {[...Array(2)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}

        <div className="flex justify-end">
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  )
}
