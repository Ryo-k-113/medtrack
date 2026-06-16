
import { z } from "zod"
import { AnnounceType } from "@prisma/client"

export const announceFormSchema = z.object({
  // 必須項目
  announcedDate: z.date({
    message: "告示日は必須です"
  }),  
  effectiveDate: z.date({
    message: "実施日は必須です",
  }),
  announceType: z.enum(AnnounceType,
    { message: "告示種別を選択してください" }
  ),
})

// 型定義
export type AnnounceFormData = z.infer<typeof announceFormSchema>
export type AnnounceFormInput = z.input<typeof announceFormSchema>