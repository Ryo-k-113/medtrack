"use client"

import { Button } from "@/components/ui/button"
import { FormInput } from "./FormInput"
import { FormSelectBox } from "./FormSelectBox"
import { FormDatePicker } from "./FormDatePicker"
import { Trash2 } from "lucide-react"
import { FormPublishStatusToggle } from "./FormPublishStatusToggle"
import { SHIPPING_STATUS_OPTIONS } from "../_constants/drug"

type FormPackageUnitCardProps = {
  index: number;
  onRemove: () => void;
  isRemoveDisabled: boolean;
};

export const FormPackageUnitCard = ({
  index,
  onRemove,
  isRemoveDisabled,
}: FormPackageUnitCardProps) => {
  return (
    <div className="border rounded-md overflow-hidden">

      {/* ヘッダー */}
      <div className="bg-surface border-b px-4 py-2 flex justify-between items-center">
        <p>包装 {index + 1}</p>

        <div className="flex gap-4 items-center">
          {/* 公開ステータスのトグルボタン */}
          <FormPublishStatusToggle
            name={`packageUnits.${index}.publishStatus`}
          />

          {/* 包装削除ボタン */}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="gap-1.5 shrink-0 px-4 disabled:bg-muted disabled:text-muted-foreground"
            onClick={onRemove}
            disabled={isRemoveDisabled}
            >
            <Trash2 className="h-4 w-4" />
            削除
          </Button>
        </div>
      </div>

      {/* カード内容 */}
      {/* 基本情報 */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <FormInput
          name={`packageUnits.${index}.name`}
          label="包装名"
          required
        />
        <FormSelectBox
          name={`packageUnits.${index}.currentShippingStatus`}
          label="出荷状況"
          options={SHIPPING_STATUS_OPTIONS}
          required
        />
        <FormDatePicker
          name={`packageUnits.${index}.announcementDate`}
          label="告示日"
          required
        />
        <FormDatePicker
          name={`packageUnits.${index}.effectiveDate`}
          label="実施日"
          required
        />
      </div>

      {/* コード情報 */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <FormInput
          name={`packageUnits.${index}.gs1SalesCode`}
          label="販売GS1コード"
        />
        <FormInput
          name={`packageUnits.${index}.gs1DispensingCode`}
          label="調剤GS1コード"
        />
        <FormInput
          name={`packageUnits.${index}.unifiedCode`}
          label="統一商品コード"
        />
        <FormInput
          name={`packageUnits.${index}.hotCode`}
          label="HOTコード"
        />
        <FormInput
          name={`packageUnits.${index}.janCode`}
          label="JANコード"
        />
      </div>

      {/* 日付情報 */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <FormDatePicker
          name={`packageUnits.${index}.discontinuedDate`}
          label="販売中止日"
        />
        <FormDatePicker
          name={`packageUnits.${index}.transitionalDate`}
          label="経過措置期限"
        />
        <FormDatePicker
          name={`packageUnits.${index}.salesTransferDate`}
          label="販売移管日"
        />
      </div>

    </div>
  )
}