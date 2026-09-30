"use client"

import { useFieldArray } from "react-hook-form"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { FormPackageUnitCard } from "./FormPackageUnitCard"
import { DEFAULT_PACKAGE_UNIT } from "@/app/(admin)/admin/drugs/_constants/drug"

export const FormPackageUnitSection = () => {
  const { control } = useFormContext() 

  const { fields, append, remove } = useFieldArray({
    control,
    name: "packageUnits",
  })

  return (
    <div className="border p-6 rounded-md bg-background shadow-sm space-y-6">
      {/* セクションタイトル */}
      <h3 className="text-xl font-bold border-b pb-2">包装規格</h3>

      {/* 各包装の情報カード */}
      {fields.map((field, index) => (
        <FormPackageUnitCard
          key={field.id}
          index={index}
          onRemove={() => remove(index)}
          isRemoveDisabled={fields.length === 1}
        />
      ))}

      {/*  包装追加ボタン */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-2"
        // 1つ目の包装と同じ初期値で追加する
        onClick={() => append(DEFAULT_PACKAGE_UNIT)}
      >
        <Plus className="h-4 w-4 mr-2" />
        包装を追加する
      </Button>
    </div>
  )
}