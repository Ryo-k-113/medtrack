"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider} from "react-hook-form" 
import { useRouter } from "next/navigation"
import { useState } from 'react';
import { toast } from "sonner";
import { FormProductSection } from "@/app/(admin)/admin/drugs/_components/FormProductSection"
import { DrugEditActions } from "./DrugEditActions"
import { DrugEditFormSkeleton } from "./DrugEditFormSkeleton"
import { fetcher } from "@/utils/fetcher"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { useDrugFormOptions } from "@/hooks/useDrugFormOptions"
import { useAdminDrug } from "../_hooks/useAdminDrug"
import { drugEditFormSchema, type DrugEditFormData, type DrugEditFormInput } from "@/types/admin/drug";



export const DrugEditForm = () => {
  const { token } = useSupabaseSession();
  const router = useRouter()

  const [isDeleting, setIsDeleting] = useState(false)

  // 製薬会社、規格単位、成分名の一覧取得
  const {
    companyOptions,
    unitOptions,
    genericNameOptions,
    isLoading: isOptionsLoading,
    error: optionsError,
  } = useDrugFormOptions()

  //製品と包装データの取得
  const { drugId, drug, isDrugLoading, mutate, error } = useAdminDrug()

  const form = useForm<DrugEditFormInput, unknown, DrugEditFormData>({
    mode: "onBlur",
    resolver: zodResolver(drugEditFormSchema),
    values: {
      name: drug?.name ?? "",
      yjCode: drug?.yjCode ?? "",
      price: drug?.price ?? "", 
      drugPriceListingCode: drug?.drugPriceListingCode ?? "",
      packageInsertUrl: drug?.packageInsertUrl ?? "",
      productType: drug?.productType ?? "",
      isSelectMedical: drug?.isSelectMedical ?? false,
      isAuthorizedGeneric: drug?.isAuthorizedGeneric ?? false,
      genericNameId: drug?.genericNameId ? String(drug.genericNameId) : "",
      unitId: drug?.unitId ? String(drug.unitId) : "",
      salesCompanyId: drug?.salesCompanyId ? String(drug.salesCompanyId) : "",
      manufacturingCompanyId: drug?.manufacturingCompanyId
        ? String(drug.manufacturingCompanyId)
        : "",
    }
  })

  // 製品の変更を保存
  const onSubmit = async ( data: DrugEditFormData ) => {
    try {
      const res = await fetcher({
        url: `/api/admin/drugs/${drugId}`,
        method: "PUT",
        body: data,
        token,
      })
      toast.success(res.message)
      await mutate()

    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  // 製品の削除(包装もカスケード削除)
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetcher({
        url: `/api/admin/drugs/${drugId}`,
        method: "DELETE",
        token,
      })

      toast.success(res.message)
      router.replace("/admin/drugs")

    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsDeleting(false)
    }
  }
  
  // ローディング表示
  if (isDrugLoading || isOptionsLoading) return <DrugEditFormSkeleton />

  // エラー表示
  if (error || optionsError) return <div>エラーが発生しました</div>

  return (
    <div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>

          {/* 製品情報 */}
          <div className="py-10">
            <FormProductSection
              companyOptions={companyOptions}
              unitOptions={unitOptions}
              genericNameOptions={genericNameOptions}
              editActions={
                <DrugEditActions 
                onDelete={handleDelete} 
                isDeleting={isDeleting}
                />
              }
              />
          </div>
        </form>
      </FormProvider>

    </div>
  )
}