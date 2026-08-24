"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BaseDialog } from "@/components/Dialog/BaseDialog"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { useAdminPackageUnit } from "../_hooks/useAdminPackageUnit"
import { fetcher } from "@/utils/fetcher"
import { ANNOUNCE_TYPE_OPTIONS } from "@/app/(admin)/admin/drugs/_constants/drug"
import type { ShippingAnnouncement } from "@/types/drug"
import { FormDatePicker } from "@/components/Form/FormDatePicker"
import { FormSelectBox } from "@/components/Form/FormSelectBox"
import {
  updateAnnounceFormSchema,
  type UpdateAnnounceFormData,
  type UpdateAnnounceFormInput,
} from "@/types/admin/drug"


type Props = {
  isOpen:        boolean
  onClose:       () => void
  history:       ShippingAnnouncement | null
}

export const AnnounceEditDialog = ({
  isOpen,
  onClose,
  history,
}: Props) => {
  const { token } = useSupabaseSession()
  const { drugId, packageUnitId, mutate } = useAdminPackageUnit()

  const form = useForm<UpdateAnnounceFormInput, unknown, UpdateAnnounceFormData>({
    mode: "onBlur",
    resolver: zodResolver(updateAnnounceFormSchema),
    values: {
      announcedDate: history?.announcedDate
        ? new Date(history.announcedDate)
        : null,
      effectiveDate: history?.effectiveDate
        ? new Date(history.effectiveDate)
        : null,
      announceType: history?.announceType ?? null,
    }
  })

  const { handleSubmit, formState: { isSubmitting, isDirty }, reset } = form

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data: UpdateAnnounceFormData) => {
    try {
      const res = await fetcher({
        url: `/api/admin/drugs/${drugId}/packages/${packageUnitId}/announce/${history?.id}`,
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

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={handleClose}
      title="告示を編集する"
      className="w-full sm:max-w-xl"
      actions={
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-28"
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            form="announceEditForm"
            disabled={isSubmitting || !isDirty}
            className="w-28"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "保存中..." : "保存する"}
          </Button>
        </div>
      }
    >
      <FormProvider {...form}>
        <form
          id="announceEditForm"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormDatePicker
              name="announcedDate"
              label="告示日"
              required
            />
            <FormDatePicker
              name="effectiveDate"
              label="実施日"
              required
            />
            <FormSelectBox
              name="announceType"
              label="告示種別"
              options={ANNOUNCE_TYPE_OPTIONS}
              required
            />
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}