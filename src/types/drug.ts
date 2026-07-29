import type { PackageUnit as PrismaPackageUnit, Drug as PrismaDrug } from "@prisma/client"


/** 包装の基本型 */
export type PackageUnit = Omit<
  PrismaPackageUnit,
  "salesTransferDate" | "discontinuedDate"| "createdAt" | "updatedAt" 
> & {
  // Date型をstringへ変更
  salesTransferDate: string | null
  discontinuedDate: string | null
  createdAt: string
  updatedAt: string
}

/** 医薬品の基本型 */
export type Drug = Omit<PrismaDrug, "price" | "transitionalMeasuresDate" | "createdAt" | "updatedAt"> & {
  price: number | null; // Decimal型を numberへ変更

  // Date型をstringへ変更
  transitionalMeasuresDate: string | null; 
  createdAt: string
  updatedAt: string
}
