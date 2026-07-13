import type { PackageUnit as PrismaPackageUnit, Drug as PrismaDrug } from "@prisma/client"


/** 包装の基本型 */
export type PackageUnit = Omit<
  PrismaPackageUnit,
  "salesTransferDate" | "discontinuedDate" | "transitionalMeasuresDate"
> & {
  // Date型をstringへ変更
  salesTransferDate: string | null
  discontinuedDate: string | null
  transitionalMeasuresDate: string | null
}

/** 包装の基本型 */
export type Drug = Omit<PrismaDrug, "price"> & {
  // Decimal型を numberへ変更
  price: number | null;
}
