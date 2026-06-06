"use client"
import * as React from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider} from "react-hook-form" 
import { useRouter, useParams } from "next/navigation"
import { useState } from 'react';
import { toast } from "sonner";
import { FormProductSection } from "@/app/(admin)/admin/drugs/_components/FormProductSection"
import { PackageUnitListSection } from "./PackageUnitListSection"
import { DrugEditActions } from "./DrugEditActions"
import { fetcher } from "@/utils/fetcher"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { useDataFetch } from "@/hooks/useDataFetch"
import { useDrugFormOptions } from "@/hooks/useDrugFormOptions"
import {
  drugEditFormSchema,
  type DrugEditFormData,
  type DrugEditFormInput,
} from "@/app/(admin)/admin/drugs/_schemas/drug"



export const DrugEditForm = () => {
  const { token } = useSupabaseSession();
  const params = useParams()
  const router = useRouter()

  const [isDeleting, setIsDeleting] = useState(false)

  // 製薬会社、規格単位、成分名の一覧取得
  const { companyOptions, unitOptions, genericNameOptions, isLoading:isOptionsLoading } = useDrugFormOptions()


  //製品と包装データの取得
  const drugId = params.drugId as string
  const { data: drugData, isLoading:isDrugLoading, mutate} = useDataFetch(
    `/api/admin/drugs/${drugId}`
  )
  const drug = drugData?.data
  const packageUnits = drugData?.data?.PackageUnits ?? []

  const isLoading = isDrugLoading || isOptionsLoading

  const form = useForm<DrugEditFormInput, unknown, DrugEditFormData>({
    mode: "onBlur",
    resolver: zodResolver(drugEditFormSchema),
    values: {
      name: drug?.name ?? "",
      yjCode: drug?.yjCode ?? "",
      price: drug?.price ?? undefined,
      drugPriceListingCode: drug?.drugPriceListingCode ?? "",
      packageInsertUrl: drug?.packageInsertUrl ?? "",
      productType: drug?.productType ?? "",
      isSelectMedical: drug?.isSelectMedical ?? false,
      isAuthorizedGeneric: drug?.isAuthorizedGeneric ?? false,
      GenericNameId: String(drug?.GenericNameId ?? ""),
      UnitId: String(drug?.UnitId ?? ""),
      SalesCompanyId: String(drug?.SalesCompanyId ?? ""),
      ManufacturingCompanyId: String(drug?.ManufacturingCompanyId ?? ""),
    } 
  })

  const { 
    handleSubmit, 
    formState: { isSubmitting, isDirty } 
  } = form


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
  
  if (isLoading) return <div>読み込み中...</div>
  if (!drug) return <div>データが見つかりません</div>

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>

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
        
        {/* 包装一覧 */}
        <PackageUnitListSection
          packageUnits={packageUnits}
          drugId={drugId}
        />
      </form>
    </FormProvider>
  )
}