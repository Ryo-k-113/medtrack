"use client"
import { FormDatePicker } from "@/components/Form/FormDatePicker"
import { FormSelectBox } from "@/components/Form/FormSelectBox"
import { ANNOUNCE_TYPE_OPTIONS } from "@/app/(admin)/admin/drugs/_constants/drug"
import { cn } from "@/lib/utils"

type AnnounceFormFieldsProps = {
  className?: string
}

export const AnnounceFormFields = ({ className }: AnnounceFormFieldsProps) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      <FormDatePicker
        name="announcedDate"
        label="告知日"
        required
      />
      <FormDatePicker
        name="effectiveDate"
        label="適用日"
        required
      />
      <FormSelectBox
        name="announceType"
        label="告知種別"
        options={ANNOUNCE_TYPE_OPTIONS}
        required
      />
    </div>
  )
}
