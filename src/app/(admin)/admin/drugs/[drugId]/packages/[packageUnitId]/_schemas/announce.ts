
import { z } from "zod"
import { AnnounceType } from "@prisma/client"

export const announceFormSchema = z.object({
  // 必須項目
  announcedDate: z
    .date()
    .nullable()
    .refine((val) => val !== null, "告示日は必須です")
    .transform((date) => date.toISOString()),

  effectiveDate: z
    .date()
    .nullable()
    .refine((val) => val !== null, "実施日は必須です")
    .transform((date) => date.toISOString()),

  announceType: z
    .enum( AnnounceType )
    .nullable()
    .refine((val) => val !== null, "告示種別は必須です"),
})

// 型定義
export type AnnounceFormData = z.infer<typeof announceFormSchema>
export type AnnounceFormInput = z.input<typeof announceFormSchema>