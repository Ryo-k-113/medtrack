"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useLoginMethods } from "../_hooks/useLoginMethods"
import { LoginMethodRow } from "./LoginMethodRow"
import { EmailChangeDialog } from "./EmailChangeDialog"


// ログイン方法ごとの設定をまとめて表示する
export const AccountSettings = () => {
  const { isLoading, isLoggedIn, googleEmail, loginEmail } = useLoginMethods()
  const [isDialogOpen, setIsDialogOpen] = useState(false)


  if (!isLoggedIn) {
    return (
      <p className="py-12 text-center text-sm text-weak">
        ログインすると表示されます。
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {/* Googleログイン */}
      <LoginMethodRow
        title="Googleログイン"
        email={googleEmail}
      />

      {/* メールアドレスログイン */}
      <LoginMethodRow
        title="メールアドレスログイン"
        email={loginEmail}
        action={
          loginEmail && (
            <Button variant="surface" size="sm" onClick={() => setIsDialogOpen(true)}>
              変更
            </Button>
          )
        }
        description={
          loginEmail &&
          "変更ボタンを押して新しいメールアドレスを入力すると、確認メールを送信します。"
        }
      />

      <EmailChangeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  )
}
