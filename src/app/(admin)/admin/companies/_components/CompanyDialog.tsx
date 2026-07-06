"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

import { BaseDialog } from "@/components/Dialog/BaseDialog"
import { FormInput } from "@/components/Form/FormInput"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { useAdminCompanies } from "../_hooks/useAdminCompanies"
import { fetcher } from "@/utils/fetcher"
import {type CompanyFormData, companyFormSchema } from "../_schemas/company"
import type { Company } from "@/types/admin/company"

type Props = {
  isOpen: boolean
  onClose: () => void
  company?: Company 
}

export const CompanyDialog = ({ isOpen, onClose, company }: Props) => {
  const { token } = useSupabaseSession()
  const { mutate } = useAdminCompanies()

   // companyがある場合は編集・ない場合は新規作成の分岐
  const isEdit = !!company

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    ...(isEdit
      ? { values: { name: company.name } }
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
  const onSubmit = async (data: CompanyFormData) => {
    try {
      const res = await fetcher({
        url: isEdit
        ? `/api/admin/companies/${company.id}` // 編集
        : "/api/admin/companies",              //  新規作成
        method: isEdit ? "PUT" : "POST",
        body: data,
        token,
      })
      toast.success(res.message)
      await mutate()
      handleClose()

    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  return (
    <FormProvider {...form}>
      <BaseDialog
        isOpen={isOpen}
        onClose={handleClose}
        title={isEdit ? "製薬会社を編集する" : "製薬会社を追加する"}
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
              form="companyForm"
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
          id="companyForm"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-2"
        >
          <div>
            <FormInput
              name="name"
              label="会社名"
              required
            />
          </div>
        </form>

      </BaseDialog>
    </FormProvider>
  )
}