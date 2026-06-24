"use client"
import { FormInput } from "@/app/(admin)/admin/drugs/_components/FormInput"
import { FormSelectBox } from "@/app/(admin)/admin/drugs/_components/FormSelectBox"
import { FormDatePicker } from "@/app/(admin)/admin/drugs/_components/FormDatePicker"
import { FormPublishStatusToggle } from "@/app/(admin)/admin/drugs/_components/FormPublishStatusToggle"
import { SHIPPING_STATUS_OPTIONS } from "../_constants/drug"
import { cn } from "@/lib/utils"


type PackageUnitFormFieldsProps = {
  showShippingStatus?: boolean
  showDateFields?: boolean
  className?: string   
  basicClassName?: string   
  codeClassName?: string    
  dateClassName?: string 
}

export const PackageUnitFormFields = ({
  showShippingStatus = false,
  showDateFields = false,
  className,
  basicClassName,
  codeClassName,
  dateClassName,
}: PackageUnitFormFieldsProps) => {
  return (
    <div className={cn("space-y-4 py-4", className)}>

      {/* 公開ステータス */}
      <div className="flex justify-end">
        <FormPublishStatusToggle name="publishStatus" />
      </div>

      {/* 基本情報 */}
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", basicClassName)}>
        <FormInput
          name="name"
          label="包装名"
          required
        />

        {/* 出荷ステータス */}
        {showShippingStatus && (
          <FormSelectBox
            name="currentShippingStatus"
            label="出荷ステータス"
            options={SHIPPING_STATUS_OPTIONS}
            required
          />
        )}
      </div>

      {/* コード情報 */}
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", codeClassName)}>
        <FormInput name="gs1SalesCode" label="販売GS1コード" />
        <FormInput name="gs1DispensingCode" label="調剤GS1コード" />
        <FormInput name="unifiedCode" label="統一商品コード" />
        <FormInput name="hotCode" label="HOTコード" />
        <FormInput name="janCode" label="JANコード" />
      </div>

      {/* 日付情報 */}
      {showDateFields && (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", dateClassName)}>
          <FormDatePicker
            name="discontinuedDate"
            label="販売中止日"
          />
          <FormDatePicker
            name="salesTransferDate"
            label="販売移管日"
          />
        </div>
      )}
    </div>
  )
}