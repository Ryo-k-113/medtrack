"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider} from "react-hook-form" 
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { toast } from "sonner";
import { FormProductSection } from "./FormProductSection"
import { FormPackageUnitSection } from "./FormPackageUnitSection"
import { drugFormSchema, type DrugFormData, type DrugFormInput, DEFAULT_DRUG_FORM_VALUES } from "../_schemas/drug"
import { fetcher } from "@/utils/fetcher"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { useRouter } from "next/navigation"
import { useDrugFormOptions } from "@/hooks/useDrugFormOptions"


export const DrugCreateForm = () => {
  const { token } = useSupabaseSession();
  const router = useRouter();

  // 製薬会社、規格単位、成分名の一覧取得
  const { companyOptions, unitOptions, genericNameOptions, isLoading } = useDrugFormOptions()


  const form = useForm<DrugFormInput, unknown, DrugFormData>({
    mode: "onBlur",
    resolver: zodResolver(drugFormSchema),
    defaultValues: DEFAULT_DRUG_FORM_VALUES as DrugFormInput,
  });

  const { 
    handleSubmit,
    formState: { isSubmitting } 
  } = form;

  const onSubmit = async (data: DrugFormData) => {
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

