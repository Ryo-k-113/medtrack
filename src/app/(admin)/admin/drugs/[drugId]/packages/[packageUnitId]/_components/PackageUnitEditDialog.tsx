"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Pencil, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BaseDialog } from "@/components/Dialog/BaseDialog"
import { PackageUnitFormFields } from "@/app/(admin)/admin/_components/PackageUnitFormFields"

import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { useAdminPackageUnit } from "../_hooks/useAdminPackageUnit"
import { fetcher } from "@/utils/fetcher"

import { packageUnitEditFormSchema, type PackageUnitEditFormData, type PackageUnitEditFormInput, } from "../_schemas/drug"


export const PackageUnitEditDialog = () => {
  const { token } = useSupabaseSession()

  // 製品・包装ID、包装情報を取得
  const { drugId, packageUnitId, packageUnit, mutate } = useAdminPackageUnit()

  // ダイアログ開閉の状態管理
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<PackageUnitEditFormInput, unknown, PackageUnitEditFormData>({
    mode: "onBlur",
    resolver: zodResolver(packageUnitEditFormSchema),
    values: {
      name: packageUnit?.name ?? "",
      publishStatus: packageUnit?.publishStatus ?? "DRAFT",
      gs1SalesCode: packageUnit?.gs1SalesCode ?? "",
      gs1DispensingCode: packageUnit?.gs1DispensingCode ?? "",
      unifiedCode: packageUnit?.unifiedCode ?? "",
      hotCode: packageUnit?.hotCode ?? "",
      janCode: packageUnit?.janCode ?? "",
    } 
  })

  const { handleSubmit, formState: { isSubmitting, isDirty }, reset } = form


  // ダイアログを閉じる
  const handleClose = () => {
    reset()
    setIsOpen(false)
  }

  // 送信処理
  const onSubmit = async (data: PackageUnitEditFormData) => {
    try {
      const res = await fetcher({
        url: `/api/admin/drugs/${drugId}/packages/${packageUnitId}`,
        method: "PUT",
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
  
  if (!packageUnit) return null

  return (
    <FormProvider {...form}>

        {/* 編集ボタン */}
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          <Pencil className="h-4 w-4" />
          編集する
        </Button>

        {/* 編集ダイアログ */}
        <BaseDialog
          isOpen={isOpen}
          onClose={handleClose}
          title="包装情報を編集する"
          className="max-w-2xl"
          actions={
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="hover:bg-surface hover:text-foreground"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                form="packageUnitEditForm" 
                disabled={isSubmitting || !isDirty}
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "保存中..." : "保存する"}
              </Button>
            </div>
          }
        >  
          {/* 編集フォーム */}
          <form id="packageUnitEditForm" onSubmit={handleSubmit(onSubmit)}>
            <PackageUnitFormFields />
          </form>
        </BaseDialog>
    </FormProvider>
  )
}