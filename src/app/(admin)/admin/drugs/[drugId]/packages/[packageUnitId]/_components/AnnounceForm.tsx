"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormSelectBox } from "@/components/Form/FormSelectBox"
import { FormDatePicker } from "@/components/Form/FormDatePicker"
import { fetcher } from "@/utils/fetcher"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { announceFormSchema, type AnnounceFormData, type AnnounceFormInput } from "../_schemas/announce"
import { ANNOUNCE_TYPE_OPTIONS } from "@/app/(admin)/admin/drugs/_constants/drug"
import { useAdminPackageUnit } from "../_hooks/useAdminPackageUnit"


export const AnnounceForm = () => {
  const { token } = useSupabaseSession()
  const { drugId, packageUnitId, mutate } = useAdminPackageUnit()

  const form = useForm<AnnounceFormInput, unknown, AnnounceFormData>({
    mode: "onBlur",
    resolver: zodResolver(announceFormSchema),
    defaultValues: {
      announcedDate: null,
      effectiveDate: null,
      announceType: null,
    }
  })

  const { handleSubmit, formState: { isSubmitting }, reset } = form

  const onSubmit = async ( data: AnnounceFormData ) => {
    try {
      const res = await fetcher({
        url: `/api/admin/drugs/${drugId}/packages/${packageUnitId}/announce`,
        method: "POST",
        body: data,
        token,
      })
      toast.success(res.message)
      reset()
      await mutate()
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  return (
    <div className="border rounded-lg p-5 bg-background shadow-sm mb-4">
      <div className="flex justify-between items-center border-b pb-4 mb-4">  
        <h3 className="font-bold">出荷告示</h3>
      </div>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* 告示種別・告示日・実施日 */}
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

          {/* ボタン */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "登録中..." : "登録する"}
            </Button>
          </div>

        </form>
      </FormProvider>
    </div>
  )
}