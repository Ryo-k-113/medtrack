"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"

import { BaseDialog } from "@/components/Dialog/BaseDialog"
import { FormInput } from "@/components/Form/FormInput"
import { type GenericName, type GenericNameFormData, genericNameFormSchema } from "@/types/admin/genericName"

type Props = {
  isOpen: boolean
  onClose: () => void
  genericName?: GenericName 
  onSubmit: (data: GenericNameFormData) => Promise<void>
}

export const GenericNameDialog = ({ isOpen, onClose, genericName, onSubmit }: Props) => {

  // genericNameがある場合は編集・ない場合は新規作成の分岐
  const isEdit = !!genericName

  const form = useForm<GenericNameFormData>({
    resolver: zodResolver(genericNameFormSchema),
    ...(isEdit
      ? { values: { name: genericName.name } }
      : { defaultValues: { name: "" } }
    ),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
    reset,
  } = form


  // ダイアログを閉じる
  const handleClose = () => {
    reset()
    onClose()
  }

  // フォームを送信
  const handleSubmitForm = async (data: GenericNameFormData) => {
    await onSubmit(data) 
    handleClose()
  }
    

  return (
    <FormProvider {...form}>

      {/* ダイアログ */}
      <BaseDialog
        isOpen={isOpen}
        onClose={handleClose}
        title={isEdit ? "成分名を編集する" : "成分名を追加する"} // 
        className="max-w-md"
        actions={
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-24 hover:bg-surface hover:text-foreground"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              form="genericNameForm" 
              disabled={isSubmitting || (isEdit && !isDirty) }
              className="w-24"
            >
              {isSubmitting ? "登録中..." : "登録する"}
            </Button>
          </div>
        }
      > 
        {/* フォーム */}
        <form
          id="genericNameForm"
          onSubmit={handleSubmit(handleSubmitForm)}
          className="space-y-4 py-2"
        >
          <div>
            <FormInput
              name="name"
              label="成分名"
              required
            />
          </div>
        </form>

      </BaseDialog>
    </FormProvider>
  )
}