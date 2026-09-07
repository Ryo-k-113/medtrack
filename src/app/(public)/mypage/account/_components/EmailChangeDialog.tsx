"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { BaseDialog } from "@/components/Dialog/BaseDialog"
import { FormInput } from "@/components/Form/FormInput"
import { updateEmailHandler } from "@/lib/supabase-auth/accountHandler"
import {
  emailChangeSchema,
  type EmailChangeFormData,
} from "../_schemas/accountSchema"

type EmailChangeDialogProps = {
  isOpen: boolean
  onClose: () => void
}

// メールアドレスの変更ダイアログ（確認メールの送信まで行う）
export const EmailChangeDialog = ({ isOpen, onClose }: EmailChangeDialogProps) => {
  const form = useForm<EmailChangeFormData>({
    resolver: zodResolver(emailChangeSchema),
    mode: "onBlur",
    defaultValues: { email: "" },
  })

  const { handleSubmit, reset, formState: { isSubmitting } } = form

  // 入力内容を残さないよう、閉じるときにフォームを初期化する
  const closeDialog = () => {
    reset()
    onClose()
  }

  const onSubmit = async (formData: EmailChangeFormData) => {
    const isSuccess = await updateEmailHandler(formData.email)

    if (isSuccess) closeDialog()
  }

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={closeDialog}
      title="メールアドレスの変更"
      description="新しいメールアドレスを入力してください。確認メールが送信されます。"
      className="w-full max-w-[560px]"
      actions={
        <>
          <Button
            type="button"
            variant="surface"
            onClick={closeDialog}
            disabled={isSubmitting}
            className="w-24"
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            form="emailChangeForm"
            disabled={isSubmitting}
            className="w-24 font-semibold"
          >
            {isSubmitting ? "送信中..." : "送信"}
          </Button>
        </>
      }
    >
      <FormProvider {...form}>
        <form id="emailChangeForm" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            name="email"
            label="新しいメールアドレス"
            type="email"
            placeholder="sample@example.jp"
            required
          />
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
