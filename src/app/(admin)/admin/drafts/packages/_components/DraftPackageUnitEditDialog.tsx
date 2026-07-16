"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BaseDialog } from "@/components/Dialog/BaseDialog"
import { PackageUnitFormFields } from "@/app/(admin)/admin/drugs/_components/PackageUnitFormFields"
import { fetcher } from "@/utils/fetcher"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { packageUnitEditFormSchema, type PackageUnitEditFormData, type PackageUnitEditFormInput } from "@/types/admin/drug"
import type { DraftPackageUnit } from "@/types/admin/draft"



type Props = {
  isOpen: boolean
  onClose: () => void
  packageUnit: DraftPackageUnit | null
  onSuccess: () => void
}

export const DraftPackageUnitEditDialog = ({
  isOpen,
  onClose,
  packageUnit,
  onSuccess,
}: Props) => {
  const { token } = useSupabaseSession()

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

  // 編集フォームの送信
  const onSubmit = async (data: PackageUnitEditFormData) => {
    if (!packageUnit) return
    try {
      const res = await fetcher({
        url: `/api/admin/drugs/${packageUnit.DrugId}/packages/${packageUnit.id}`,
        method: "PUT",
        body: data,
        token,
      })
      toast.success(res.message)
      onSuccess()
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
        title="包装情報を編集する"
        className="max-w-2xl"
        actions={
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              form="draftPackageUnitEditForm"
              disabled={isSubmitting || !isDirty}
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "保存中..." : "保存する"}
            </Button>
          </div>
        }
      > 
        {/* 包装情報の編集フォーム */}
        <form
          id="draftPackageUnitEditForm"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-2"
        >
          <PackageUnitFormFields />
         
        </form>
      </BaseDialog>
    </FormProvider>
  )
}