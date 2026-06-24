"use client"

import { FormInput } from "./FormInput"
import { FormSelectBox } from "./FormSelectBox"
import { FormCheckbox } from "./FormCheckbox"
import { FormCombobox } from "./FormCombobox"
import { PRODUCT_TYPE_OPTIONS } from "@/app/(admin)/admin/_constants/drug"
import { SelectOption } from "@/types/ui/select"

type FormProductSectionProps = {
  companyOptions: readonly SelectOption[];
  unitOptions: readonly SelectOption[];
  genericNameOptions: readonly SelectOption[];
  editActions?: React.ReactNode
};

export const FormProductSection = ({
  companyOptions,
  unitOptions,
  genericNameOptions,
  editActions,
}: FormProductSectionProps) => {
  return (
    <div className="border rounded-md bg-background shadow-sm">
      <div className="flex justify-between items-center border-b px-6 py-4">
        <h3 className="text-xl font-bold">製品情報</h3>
        {editActions}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">

        {/* 基本情報 */}
        <div className="flex flex-col gap-4 bg-surface border p-4 rounded-md">
          <FormInput
            name="name"  
            label="医薬品名" 
            placeholder="例: ロキソニン錠" 
            required
          />
          <FormCombobox 
            name="GenericNameId" 
            label="成分名" 
            options={genericNameOptions} 
            required
          />
          <FormInput 
            name="price" 
            label="薬価" 
            type="number" 
            placeholder="例: 10.5" 
          />
          <FormCombobox 
            name="UnitId" 
            label="規格単位" 
            options={unitOptions} 
            required
          />
        </div>

        {/* メーカー情報 */}
        <div className="flex flex-col gap-4 bg-surface border p-4 rounded-md">
          <FormInput 
            name="yjCode" 
            label="YJコード" 
            required
          />
          <FormInput 
            name="drugPriceListingCode" 
            label="薬価収載コード" 
          />
          <FormCombobox 
            name="SalesCompanyId" 
            label="販売会社" 
            options={companyOptions} 
            required
          />
          <FormCombobox 
            name="ManufacturingCompanyId" 
            label="製造会社" 
            options={companyOptions} 
            required
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