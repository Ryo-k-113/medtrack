"use client"
import { useWatch } from "react-hook-form"
import { FormDatePicker } from "@/components/Form/FormDatePicker"
import { FormSelectBox } from "@/components/Form/FormSelectBox"
import { FormCheckbox } from "@/components/Form/FormCheckbox"
import { ANNOUNCE_TYPE_OPTIONS } from "@/app/(admin)/admin/drugs/_constants/drug"
import { cn } from "@/lib/utils"

type AnnounceFormFieldsProps = {
  className?: string
}

export const AnnounceFormFields = ({ className }: AnnounceFormFieldsProps) => {
  // 在庫消尽後の告知は、適用日を目安として扱う
  const isAfterStockDepletion = useWatch({ name: "isAfterStockDepletion" })

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormDatePicker
          name="announcedDate"
          label="告知日"
          required
        />
        <FormDatePicker
          name="effectiveDate"
          label={isAfterStockDepletion ? "適用日（在庫消尽の目安）" : "適用日"}
          required
        />
        <FormSelectBox
          name="announceType"
          label="告知種別"
          options={ANNOUNCE_TYPE_OPTIONS}
          required
        />
      </div>
      <FormCheckbox
        name="isAfterStockDepletion"
        label="在庫消尽後"
        description="在庫がなくなり次第ステータスが変わります。適用日には目安の月初を設定。目安が無ければ告知日と同日に設定"
      />
    </div>
  )
}
