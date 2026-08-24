"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetcher } from "@/utils/fetcher"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { announceFormSchema, type AnnounceFormData, type AnnounceFormInput } from "../_schemas/announce"
import { AnnounceFormFields } from "./AnnounceFormFields"
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

  // 告示の登録
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
          <AnnounceFormFields />

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