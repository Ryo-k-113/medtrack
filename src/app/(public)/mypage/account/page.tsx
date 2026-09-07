import { Suspense } from "react"
import { AccountSettings } from "./_components/AccountSettings"
import { AccountSettingsSkeleton } from "./_components/AccountSettingsSkeleton"

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold md:text-xl">アカウント設定</h2>

      <Suspense fallback={<AccountSettingsSkeleton />}>
        <AccountSettings />
      </Suspense>
    </div>
  )
}
