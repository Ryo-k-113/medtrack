"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider} from "react-hook-form" 
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { toast } from "sonner";
import { FormProductSection } from "./FormProductSection"
import { FormPackageUnitSection } from "./FormPackageUnitSection"
import { createDrugFormSchema,type CreateDrugFormData, type CreateDrugFormInput, } from "@/types/admin/drug"
import {  DEFAULT_DRUG_FORM_VALUES } from "@/app/(admin)/admin/drugs/_constants/drug"
import { fetcher } from "@/utils/fetcher"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { useRouter } from "next/navigation"
import { useDrugFormOptions } from "@/hooks/useDrugFormOptions"


export const DrugCreateForm = () => {
  const { token } = useSupabaseSession();
  const router = useRouter();

  // 製薬会社、規格単位、成分名の一覧取得
  const { companyOptions, unitOptions, genericNameOptions, isLoading } = useDrugFormOptions()


  const form = useForm<CreateDrugFormInput, unknown, CreateDrugFormData>({
    mode: "onBlur",
    resolver: zodResolver(createDrugFormSchema),
    defaultValues: DEFAULT_DRUG_FORM_VALUES ,
  });

  const { 
    handleSubmit,
    formState: { isSubmitting ,errors} 
  } = form;
  console.log(errors)
  const onSubmit = async (data: CreateDrugFormData) => {
    console.log(data)
    try {
      const response = await fetcher({
        url: "/api/admin/drugs",
        method: "POST",
        token,
        body: data,
      })
      if (!response) throw new Error()
      
      toast.success(response.message);
      router.push(`/admin/drugs/${response.data.id}`)

    } catch(error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }
  
  if (isLoading) return <div>読み込み中...</div>

  return (
    <div>
      {/* 医薬品の登録フォーム */}
      <div className="py-8">
        {/* FormContext用Provider */}
        <FormProvider {...form}> 
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-8"
          >
            {/*  製品エリア */}
            <FormProductSection 
              companyOptions={companyOptions}
              unitOptions={unitOptions}
              genericNameOptions={genericNameOptions}
            />

            {/* 包装規格エリア */}
            <FormPackageUnitSection />

            {/*  フォーム送信ボタン */}
            <div className="flex gap-4 pt-4 justify-end">
              <Button 
                type="submit"       
                className="h-12 w-full md:w-80"
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4 mr-2" />
                登録する
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

