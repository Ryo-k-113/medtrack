"use client"
import { useState } from "react" 
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import { BaseDialog } from "@/components/Dialog/BaseDialog"
import { PackageUnitFormFields } from "@/app/(admin)/admin/drugs/_components/PackageUnitFormFields"
import { DEFAULT_PACKAGE_UNIT } from "@/app/(admin)/admin/drugs/_constants/drug"
import { createPackageUnitFormSchema, type CreatePackageUnitFormData, type CreatePackageUnitFormInput,  } from "@/types/admin/drug"
import { fetcher } from "@/utils/fetcher"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { useAdminDrug } from "../_hooks/useAdminDrug"


export const PackageUnitAddDialog = () => {
  const { token } = useSupabaseSession()
  
  //医薬品IDの取得
  const { drugId, mutate } = useAdminDrug()

  // モーダルの開閉
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<CreatePackageUnitFormInput, unknown, CreatePackageUnitFormData>({
    mode: "onBlur",
    resolver: zodResolver(createPackageUnitFormSchema),
    defaultValues: DEFAULT_PACKAGE_UNIT,
  })

  const { handleSubmit, formState: { isSubmitting }, reset } = form

  // モーダルを閉じる
  const handleClose = () => {
    reset()
    setIsOpen(false)
  }

  // 包装追加
  const onSubmit = async (data: CreatePackageUnitFormData) => {
    try {
      const res = await fetcher({
        url: `/api/admin/drugs/${drugId}`,
        method: "POST",
        body: data,
        token,
      }) 
      toast.success( res.message )
      handleClose()
      mutate()

    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } 
  }

  return (
    <div>
      {/* 包装追加ボタン */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-2 py-4"
        onClick={() => setIsOpen(true)} 
      >
        <Plus className="h-4 w-4 mr-2" />
        包装を追加する
      </Button>

      {/* 新規包装追加ダイアログ */}
      <BaseDialog
        isOpen={isOpen}
        onClose={handleClose}
        title="包装を追加する"
        className="max-w-4xl"
        actions={
          <>
            <Button
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              onClick={handleClose}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              form="packageUnitAddForm"
              disabled={isSubmitting}
            >
              追加する
            </Button>
          </>
        }
      >
        <FormProvider {...form}>
          <form 
            id="packageUnitAddForm" 
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* 包装フォームアイテム */}
            <PackageUnitFormFields
              showShippingStatus
              showDateFields
              basicClassName="md:grid-cols-2 w-4/5"
              codeClassName="md:grid-cols-5"
              dateClassName="md:grid-cols-5"
            />
          </form>
        </FormProvider>
      </BaseDialog>
    </div>
  );
}