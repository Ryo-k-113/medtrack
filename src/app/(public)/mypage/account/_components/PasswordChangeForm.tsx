"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/Form/PasswordInput"
import { updatePasswordHandler } from "@/lib/supabase-auth/accountHandler"
import {
  passwordChangeSchema,
  type PasswordChangeFormData,
} from "../_schemas/accountSchema"


// 新しいパスワードをページ内で設定するフォーム
export const PasswordChangeForm = () => {
  const form = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const { handleSubmit, reset, formState: { isSubmitting } } = form

  const onSubmit = async (formData: PasswordChangeFormData) => {
    const isSuccess = await updatePasswordHandler(formData.password)

    // 成功時は初期化する
    if (isSuccess) reset()
  }

  return (
    <section className="space-y-4">
      <h3 className="font-bold">パスワード変更</h3>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <PasswordInput
            name="password"
            label="新しいパスワード"
            required
            description="英字・数字・記号（@$!%*#?&）を含む8文字以上"
          />

          <PasswordInput
            name="confirmPassword"
            label="新しいパスワード(確認)"
            required
          />

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-24 font-semibold"
            >
              {isSubmitting ? "更新中..." : "更新"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  )
}
