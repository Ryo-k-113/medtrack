"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { BaseDialog } from "@/components/Dialog/BaseDialog"
import { FormSelectBox } from "@/components/Form/FormSelectBox"
import { SHIPPING_STATUS_OPTIONS } from "@/app/(admin)/admin/drugs/_constants/drug"
import { fetcher } from "@/utils/fetcher"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { useAdminPackageUnit } from "../_hooks/useAdminPackageUnit"
import {
  inactivateAnnounceFormSchema,
  type InactivateAnnounceFormData,
  type InactivateAnnounceFormInput,
} from "@/types/admin/drug"


type InactivateAnnounceDialogProps = {
  isOpen: boolean
  onClose: () => void
  announceId: number | null
}

export const InactivateAnnounceDialog = ({
  isOpen,
  onClose,
  announceId,
}: InactivateAnnounceDialogProps) => {
  const { token } = useSupabaseSession()
  const { drugId, packageUnitId, packageUnit, mutate } = useAdminPackageUnit()


  const form = useForm<InactivateAnnounceFormInput, unknown, InactivateAnnounceFormData>({
    resolver: zodResolver(inactivateAnnounceFormSchema),
    values: {
      currentShippingStatus: packageUnit?.currentShippingStatus ?? "" 
    },
  })

  const { handleSubmit, formState: { isSubmitting }, reset } = form

  // ダイアログを閉じる
  const handleClose = () => {
    reset()
    onClose()
  }

  // 非表示化の実行
  const onSubmit = async (data: InactivateAnnounceFormData) => {
    try {
      const res = await fetcher({
        url: `/api/admin/drugs/${drugId}/packages/${packageUnitId}/announce/${announceId}/inactive`,
        method: "POST",
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
      <BaseDialog
        isOpen={isOpen}
        onClose={handleClose}
        title="告示を非表示にする"
        description="この操作は取り消せません。必要であれば出荷状況を変更してください。"
        className="max-w-md"
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
              form="inactivateAnnounceForm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "処理中..." : "非表示にする"}
            </Button>
          </>
        }
      >
        <form
          id="inactivateAnnounceForm"
          onSubmit={handleSubmit(onSubmit)}>
          <FormSelectBox
            name="currentShippingStatus"
            label="現在の出荷状況"
            options={SHIPPING_STATUS_OPTIONS}
          />
        </form>
      </BaseDialog>
    </FormProvider>
  )
}
