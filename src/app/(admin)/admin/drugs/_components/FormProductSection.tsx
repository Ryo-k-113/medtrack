"use client"

import { FormInput } from "./FormInput"
import { FormSelectBox } from "./FormSelectBox"
import { FormCheckbox } from "./FormCheckbox"
import { PRODUCT_TYPE_OPTIONS } from "../_constants/drug"
import { SelectOption } from "@/types/ui/select"

type FormProductSectionProps = {
  companyOptions: readonly SelectOption[];
  unitOptions: readonly SelectOption[];
};

export const FormProductSection = ({
  companyOptions,
  unitOptions,
}: FormProductSectionProps) => {
  return (
    <div className="border p-6 rounded-md bg-background shadow-sm space-y-6">
      <h3 className="text-xl font-bold border-b pb-2">製品情報</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* 基本情報 */}
        <div className="flex flex-col gap-4 bg-surface border p-4 rounded-md">
          <FormInput
            name="name"  
            label="医薬品名" 
            placeholder="例: ロキソニン錠" 
          />
          <FormInput 
            name="GenericNameId" 
            label="成分名" 
            placeholder="例: ロキソプロフェン" 
          />
          <FormInput 
            name="price" 
            label="薬価" 
            type="number" 
            placeholder="例: 10.5" 
          />
          <FormSelectBox 
            name="UnitId" 
            label="規格単位" 
            options={unitOptions} 
          />
        </div>

        {/* メーカー情報 */}
        <div className="flex flex-col gap-4 bg-surface border p-4 rounded-md">
          <FormInput 
            name="yjCode" 
            label="YJコード" 
          />
          <FormInput 
            name="drugPriceListingCode" 
            label="薬価収載コード" 
          />
          <FormSelectBox 
            name="SalesCompanyId" 
            label="販売会社" 
            options={companyOptions} 
          />
          <FormSelectBox 
            name="ManufacturingCompanyId" 
            label="製造会社" 
            options={companyOptions} 
          />
        </div>

        {/* 付属情報 */}
        <div className="flex flex-col gap-4 bg-surface border p-4 rounded-md">
          <FormSelectBox 
            name="productType" 
            label="区分" 
            options={PRODUCT_TYPE_OPTIONS} 
          />

          <FormInput 
            name="packageInsertUrl" 
            label="医薬品情報URL" 
            placeholder="https://www.pmda.go.jp/" 
          />
        </div>

        {/* チェックボックス */}
        <div className="flex flex-col gap-4 bg-surface border p-4 rounded-md">
          <FormCheckbox 
            name="isAuthorizedGeneric" 
            label="AG" 
          />
          <FormCheckbox 
            name="isSelectMedical" 
            label="選定療養対象" 
          />
        </div>
      </div>
    </div>
  )
}