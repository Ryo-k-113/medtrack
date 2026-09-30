
import { FormInput } from "@/components/Form/FormInput"
import { FormSelectBox } from "@/components/Form/FormSelectBox"
import { FormCheckbox } from "@/components/Form/FormCheckbox"
import { PRODUCT_TYPE_OPTIONS } from "@/app/(admin)/admin/drugs/_constants/drug"
import { SelectOption } from "@/types/ui/select"
import { FormDatePicker } from "@/components/Form/FormDatePicker"
import { FormAsyncCombobox } from "@/components/Form/FormAsyncCombobox"
import { useGenericNameOptions } from "@/app/(admin)/admin/drugs/_hooks/useGenericNameOptions"
import { useUnitOptions } from "@/app/(admin)/admin/drugs/_hooks/useUnitOptions"
import { useCompanyOptions } from "@/app/(admin)/admin/drugs/_hooks/useCompanyOptions"


// registered〜 は編集中の医薬品に登録済みの値（新規登録では渡さない）
// 候補の検索結果に無くても、選択欄に名前を表示するために使う
type FormProductSectionProps = {
  registeredGenericName?: SelectOption | null;
  registeredUnit?: SelectOption | null;
  registeredSalesCompany?: SelectOption | null;
  registeredManufacturingCompany?: SelectOption | null;
  editActions?: React.ReactNode
};

export const FormProductSection = ({
  registeredGenericName,
  registeredUnit,
  registeredSalesCompany,
  registeredManufacturingCompany,
  editActions,
}: FormProductSectionProps) => {
  // マスタ（成分名・規格単位・製薬会社）の候補は、入力した文字でAPIを検索して取得する
  // 検索キーワードは選択欄ごとのため、販売会社と製造会社もそれぞれ呼び出す
  const genericNameSearch = useGenericNameOptions()
  const unitSearch = useUnitOptions()
  const salesCompanySearch = useCompanyOptions()
  const manufacturingCompanySearch = useCompanyOptions()

  return (
    <div className="border rounded-md bg-background shadow-sm">
      <div className="flex justify-between items-center border-b px-6 py-4">
        <h3 className="text-xl font-bold">製品情報</h3>
        {editActions}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-10 gap-6 p-6">

        {/* 基本情報 */}
        <div className="md:col-span-4 flex flex-col gap-4 bg-surface border p-4 rounded-md">
          <FormInput
            name="name"  
            label="医薬品名" 
            placeholder="例: ロキソニン錠" 
            required
          />
          <FormAsyncCombobox
            name="genericNameId"
            label="成分名"
            search={genericNameSearch}
            registeredOption={registeredGenericName}
            required
          />
          <FormInput 
            name="price" 
            label="薬価" 
            type="number" 
            placeholder="例: 10.5" 
          />
          <FormAsyncCombobox
            name="unitId"
            label="規格単位"
            search={unitSearch}
            registeredOption={registeredUnit}
            required
          />
        </div>

        {/* メーカー情報 */}
        <div className="md:col-span-2 flex flex-col gap-4 bg-surface border p-4 rounded-md">
          <FormInput 
            name="yjCode" 
            label="YJコード" 
            required
          />
          <FormInput 
            name="drugPriceListingCode" 
            label="薬価収載コード" 
          />
          <FormAsyncCombobox
            name="salesCompanyId"
            label="販売会社"
            search={salesCompanySearch}
            registeredOption={registeredSalesCompany}
            required
          />
          <FormAsyncCombobox
            name="manufacturingCompanyId"
            label="製造会社"
            search={manufacturingCompanySearch}
            registeredOption={registeredManufacturingCompany}
            required
          />
        </div>

        {/* 付属情報 */}
        <div className="md:col-span-2 flex flex-col gap-4 bg-surface border p-4 rounded-md">
          <FormSelectBox 
            name="productType" 
            label="区分" 
            options={PRODUCT_TYPE_OPTIONS} 
            required
          />

          <FormDatePicker 
            name="transitionalMeasuresDate"
            label="経過措置日"
          />
        </div>

        {/* チェックボックス */}
        <div className="md:col-span-2 flex flex-col gap-4 bg-surface border p-4 rounded-md">
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