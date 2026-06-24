
import { z } from "zod"
import { packageUnitFormSchema } from "@/app/(admin)/admin/drugs/_schemas/drug"

export const packageUnitEditFormSchema = packageUnitFormSchema.pick({
  name: true,
  publishStatus: true,
  gs1SalesCode: true,
  gs1DispensingCode: true,
  unifiedCode: true,
  hotCode: true,
  janCode: true,
})


// 型定義
// 送信時の型（transform後）
export type PackageUnitEditFormData = z.infer<typeof packageUnitEditFormSchema>

// 入力時の型（transform前）
export type PackageUnitEditFormInput = z.input<typeof packageUnitEditFormSchema>