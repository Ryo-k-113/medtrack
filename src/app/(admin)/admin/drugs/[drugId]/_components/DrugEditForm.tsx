"use client"
import * as React from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider} from "react-hook-form" 
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { FormProductSection } from "@/app/(admin)/admin/drugs/_components/FormProductSection"
import { DrugEditActions } from "./DrugEditActions"
import { fetcher } from "@/utils/fetcher"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { useDataFetch } from "@/hooks/useDataFetch"
import { useDrugFormOptions } from "@/hooks/useDrugFormOptions"
import { ShippingStatusBadge } from "../../_components/ShipingStatusBadge"
import { PublishStatusBadge } from "../../_components/PublishStatusBadge"
import { ChevronRight, Plus } from "lucide-react"


export const DrugEditForm = () => {
  const { token } = useSupabaseSession();
  const params = useParams()
  const router = useRouter()

  // 製薬会社、規格単位、成分名の一覧取得
  const { companyOptions, unitOptions, genericNameOptions, isLoading:isOptionsLoading } = useDrugFormOptions()


  //製品と包装データの取得
  const drugId = params.drugId as string
  const { data: drugData, isLoading:isDrugLoading } = useDataFetch(
    `/api/admin/drugs/${drugId}`
  )
  const drug = drugData?.data
  const packageUnits = drugData?.data?.PackageUnits ?? []

  const isLoading = isDrugLoading || isOptionsLoading

  const form = useForm({
    mode: "onBlur",
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
  

  if (isLoading) return <div>読み込み中...</div>
  if (!drug) return <div>データが見つかりません</div>

  return (
    <FormProvider {...form}>
      <form>

        {/* 製品情報 */}
        <div className="py-10">
          <FormProductSection
            companyOptions={companyOptions}
            unitOptions={unitOptions}
            genericNameOptions={genericNameOptions}
          />
        </div>

        {/* 包装規格の一覧表示 */}
        <div className="border p-6 rounded-md bg-background shadow-sm">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h3 className="text-xl font-bold">包装規格</h3>
          </div>

          {/* 包装カードリンク */}
          {packageUnits.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/admin/drugs/${drugId}/packageUnits/${pkg.id}`}
            >
              <div className="flex items-center justify-between border rounded-md mb-3 hover:bg-surface cursor-pointer overflow-hidden">
                <div className="flex items-center gap-2 flex-1 p-4">

                  {/* 包装の情報 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p>{pkg.name}</p>
                      <ShippingStatusBadge 
                        status={pkg.currentShippingStatus} 
                        className="rounded-lg"
                      />
                    </div>
                    <p className="text-sm">
                      GS1販売コード: {pkg.gs1SalesCode} / 統一商品コード: {pkg.unifiedCode}
                    </p>
                  </div>

                  {/* 公開ステータスのバッジ */}
                  <PublishStatusBadge status={pkg.publishStatus} />
                </div>
                <div className="p-3">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}

        </div>
      </form>
    </FormProvider>
  )
}