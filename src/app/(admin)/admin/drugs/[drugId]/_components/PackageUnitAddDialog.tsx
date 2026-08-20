"use client"
import { useState } from "react" 
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import { BaseDialog } from "@/components/Dialog/BaseDialog"
import { FormInput } from "@/components/Form/FormInput"
import { FormSelectBox } from "@/components/Form/FormSelectBox"
import { FormDatePicker } from "@/components/Form/FormDatePicker"
import { SHIPPING_STATUS_OPTIONS} from "@/app/(admin)/admin/drugs/_constants/drug"
import { FormPublishStatusToggle } from "@/app/(admin)/admin/drugs/_components/FormPublishStatusToggle"
import { DEFAULT_PACKAGE_UNIT } from "@/app/(admin)/admin/drugs/_constants/drug"
import { createPackageUnitFormSchema, type CreatePackageUnitFormData, type CreatePackageUnitFormInput,  } from "@/types/admin/drug"
import { fetcher } from "@/utils/fetcher"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { useAdminDrug } from "../_hooks/useAdminDrug"


export const PackageUnitAddDialog = () => {
  const { token } = useSupabaseSession()
  
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
          <form id="packageUnitAddForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="flex justify-end items-center">
              {/* 公開ステータスのトグルボタン */}
              <FormPublishStatusToggle name="publishStatus" />
            </div>

              {/* 基本情報 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <FormInput
                  name="name" 
                  label="包装名"
                  required
                />
                <FormSelectBox
                  name="currentShippingStatus"
                  label="出荷状況"
                  options={SHIPPING_STATUS_OPTIONS}
                  required
                />    
              </div>

              {/* コード情報 */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <FormInput
                  name="unifiedCode" 
                  label="統一商品コード"
                  required
                />
                <FormInput
                  name="gs1SalesCode" 
                  label="販売GS1コード"
                />
                <FormInput
                  name="gs1DispensingCode" 
                  label="調剤GS1コード"
                />
                <FormInput
                  name="hotCode" 
                  label="HOTコード"
                />
                <FormInput
                  name="janCode" 
                  label="JANコード"
                />
              </div>

            {/* 日付情報 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <FormDatePicker
                name="discontinuedDate"
                label="販売中止日"
              />
              <FormDatePicker
                name="salesTransferDate"
                label="販売移管日"
              />
            </div>
          </form>
        </FormProvider>
      </BaseDialog>
    </div>
  );
}