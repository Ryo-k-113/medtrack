"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"

import { BaseDialog } from "@/components/Dialog/BaseDialog"
import { FormInput } from "@/components/Form/FormInput"
import { type Unit, type UnitFormData, unitSchema } from "@/types/admin/unit"

type Props = {
  isOpen: boolean
  onClose: () => void
  unit?: Unit
  onSubmit: (data: UnitFormData) => Promise<void>
}

export const UnitDialog = ({ isOpen, onClose, unit, onSubmit }: Props) => {

  // unitがある場合は編集・ない場合は新規作成の分岐
  const isEdit = !!unit

  const form = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    ...(isEdit
      ? { values: { name: unit.name } }
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
  const handleSubmitForm = async (data: UnitFormData) => {
    await onSubmit(data) 
    handleClose()
  }
    

  return (
    <FormProvider {...form}>
      <BaseDialog
        isOpen={isOpen}
        onClose={handleClose}
        title={isEdit ? "規格単位を編集する" : "規格単位を追加する"} 
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
              form="unitForm"
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
          id="unitForm"
          onSubmit={handleSubmit(handleSubmitForm)}
          className="space-y-4 py-2"
        >
          <div>
            <FormInput
              name="name"
              label="規格単位名" 
              required
            />
          </div>
        </form>

      </BaseDialog>
    </FormProvider>
  )
}