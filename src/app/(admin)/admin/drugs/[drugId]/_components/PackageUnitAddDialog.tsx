"use client"
import { useState } from "react" 
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FormInput } from "@/components/Form/FormInput"
import { FormSelectBox } from "@/components/Form/FormSelectBox"
import { FormDatePicker } from "@/components/Form/FormDatePicker"
import { SHIPPING_STATUS_OPTIONS} from "@/app/(admin)/admin/drugs/_constants/drug"
import { FormPublishStatusToggle } from "@/app/(admin)/admin/drugs/_components/FormPublishStatusToggle"

import { packageUnitFormSchema, type PackageUnitFormData, type PackageUnitFormInput, DEFAULT_PACKAGE_UNIT } from "@/app/(admin)/admin/drugs/_schemas/drug"
import { fetcher } from "@/utils/fetcher"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { useAdminDrug } from "../_hooks/useAdminDrug"


export const PackageUnitAddDialog = () => {
  const { token } = useSupabaseSession()
  
  const { drugId, mutate } = useAdminDrug()

  // モーダルの開閉
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<PackageUnitFormInput, unknown, PackageUnitFormData>({
    mode: "onBlur",
    resolver: zodResolver(packageUnitFormSchema),
    defaultValues: DEFAULT_PACKAGE_UNIT,
  })

  const { handleSubmit, formState: { isSubmitting }, reset } = form

  // 包装追加
  const onSubmit = async (data: PackageUnitFormData) => {
    try {
      const res = await fetcher({
        url: `/api/admin/drugs/${drugId}`,
        method: "POST",
        body: data,
        token,
      }) 
      toast.success( res.message )
      reset()
      setIsOpen(false)
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

      {/* モーダル */}
      <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>

        {/* 背景オーバーレイ*/}
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/70" />
        )}

        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>包装を追加する</DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

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
                  name="gs1SalesCode" 
                  label="販売GS1コード"
                />
                <FormInput
                  name="gs1DispensingCode" 
                  label="調剤GS1コード"
                />
                <FormInput
                  name="unifiedCode" 
                  label="統一商品コード"
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
                  name="transitionalMeasuresDate" 
                  label="経過措置期限"
                />
                <FormDatePicker
                  name="salesTransferDate" 
                  label="販売移管日"
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="secondary" 
                  disabled={isSubmitting}
                  onClick={() => {
                    reset() 
                    setIsOpen(false)
                  }}
                >
                  キャンセル
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  追加する
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
}