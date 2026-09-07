"use client"

import { Button } from "@/components/ui/button"
import { useLoginMethods } from "../_hooks/useLoginMethods"
import { LoginMethodRow } from "./LoginMethodRow"


// ログイン方法ごとの設定をまとめて表示する
export const AccountSettings = () => {
  const { isLoading, isLoggedIn, googleEmail, loginEmail } = useLoginMethods()


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
            <Button variant="surface" size="sm" >
              変更
            </Button>
          )
        }
        description={
          loginEmail &&
          "変更ボタンを押して新しいメールアドレスを入力すると、確認メールを送信します。"
        }
      />

    </div>
  )
}
