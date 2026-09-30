"use client"
import { FormInput } from "@/components/Form/FormInput"
import { FormSelectBox } from "@/components/Form/FormSelectBox"
import { FormPublishStatusToggle } from "@/app/(admin)/admin/drugs/_components/FormPublishStatusToggle"
import { SHIPPING_STATUS_OPTIONS } from "../_constants/drug"
import { cn } from "@/lib/utils"


/** 包装の編集で出荷状況の欄に添える注意書き（実際の変更は告知から行う） */
export const SHIPPING_STATUS_CORRECTION_NOTE =
  "データの誤りの修正用です。出荷状況が実際に変わった場合は、告知を登録してください"

type PackageUnitFormFieldsProps = {
  showShippingStatus?: boolean
  /** 出荷状況の欄の下に表示する説明 */
  shippingStatusDescription?: string
  className?: string
  basicClassName?: string
  codeClassName?: string
}

// 販売中止日・販売移管日は告知の登録で更新
export const PackageUnitFormFields = ({
  showShippingStatus = false,
  shippingStatusDescription,
  className,
  basicClassName,
  codeClassName,
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
            description={shippingStatusDescription}
            required
          />
        )}

        {/* 内訳・注記（同名の包装の見分けと中身） */}
        <FormInput
          name="breakdown"
          label="内訳"
          placeholder="10錠×10"
        />

        <FormInput
          name="variant"
          label="注記"
          placeholder="広口開栓型"
        />
      </div>

      {/* コード情報 */}
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", codeClassName)}>
        <FormInput name="gs1SalesCode" label="販売GS1コード" required />
        <FormInput name="unifiedCode" label="統一商品コード" />
        <FormInput name="gs1DispensingCode" label="調剤GS1コード" />
        <FormInput name="hotCode" label="HOTコード" />
      </div>

    </div>
  )
}