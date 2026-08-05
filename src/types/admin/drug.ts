import { z } from "zod"
import type { Drug, PackageUnit} from "@/types/drug"
import type {AnnounceType ,GenericName,
  PharmaceuticalCompany } from "@prisma/client"
import { packageUnitFormSchema } from "@/app/(admin)/admin/drugs/_schemas/drug"


// 告示履歴の型
export type AnnounceHistory = {
  id: number
  announcedDate: string | null
  effectiveDate: string | null
  announceType: AnnounceType | null
  packageUnitId: number
}



//-------------------------------------
// GET: 医薬品一覧
//-------------------------------------

/** 公開中医薬品(包装_製品)の一覧の基本型 */
export type PublishedPackageUnitResponse = Pick<PackageUnit,
  | "id"
  | "name"
  | "gs1SalesCode"
  | "unifiedCode"
  | "currentShippingStatus"
> & {
  Drug: Pick<Drug,
    | "id"
    | "name"
    | "yjCode"
    | "productType"
  > & {
      GenericName: GenericName  
      SalesCompany: PharmaceuticalCompany
    }
};

/** 公開中の医薬品一覧取得のレスポンス型 */
export type GetPublishedPackageUnitsResponse = {
  packageUnits: PublishedPackageUnitResponse[];
  totalCount: number;
};


//-------------------------------------
// POST: 新規医薬品登録
//-------------------------------------

/** 医薬品新規登録のリクエスト型(製品と複数包装) */
export type CreateDrugRequest = Omit<Drug, "id" | "transitionalMeasuresDate"> & {
  packageUnits: CreatePackageUnitRequest[];
}

/** 包装登録のリクエスト型 */
export type CreatePackageUnitRequest = Omit<PackageUnit,"id">


/** 新規医薬品登録のレスポンス型 */
export type CreateDrugResponse = {
  message: string
  data: Pick<Drug,"id">
}

//-------------------------------------
// GET: 医薬品編集
//-------------------------------------

/** 医薬品編集ページの包装カードの型 */
export type DrugEditPackageUnitCard = Pick<PackageUnit,
  "id" |
  "name" |
  "gs1SalesCode" |
  "unifiedCode" |
  "currentShippingStatus" |
  "publishStatus"
>

/** 医薬品情報と包装取得のレスポンス型 */
export type GetDrugEditResponse = {
  data: Drug & {
    PackageUnits: DrugEditPackageUnitCard[]
  }
}

// -------------------------------------
// PUT: 医薬品編集
// -------------------------------------

/** 医薬品の更新のリクエスト型 */
export type UpdateDrugRequest = Drug

/** 医薬品の更新のレスポンス型 */
export type UpdateDrugResponse = {
  message: string
}


//-------------------------------------
// DELETE: 医薬品編集
//-------------------------------------

/** 医薬品の削除のレスポンス型 */
export type DeleteDrugResponse = {
  message: string
}


//-------------------------------------
//  POST: 医薬品編集 
//-------------------------------------

/** 包装追加のリクエスト型 */
export type AddPackageUnitRequest = CreatePackageUnitRequest

/** 包装追加のレスポンス型 */
export type AddPackageUnitResponse = {
  message: string
}


//-------------------------------------
//  GET: 包装編集
//-------------------------------------

/** 包装情報と告示履歴、医薬品情報取得のレスポンス型 */
export type PackageUnitDetailResponse = {
  data: PackageUnit & {
    AnnounceHistories: AnnounceHistory[]
    Drug: Pick<Drug, "id" | "name" | "yjCode" | "transitionalMeasuresDate"> & {
      GenericName: { id: number, name: string }
      SalesCompany: {id: number, name: string }
      ManufacturingCompany: {id: number, name: string }
    }
  }
}

//-------------------------------------
// PUT: 包装情報の更新
//-------------------------------------

//* 包装編集フォームのスキーマ */
export const packageUnitEditFormSchema = packageUnitFormSchema.pick({
  name: true,
  publishStatus: true,
  gs1SalesCode: true,
  gs1DispensingCode: true,
  unifiedCode: true,
  hotCode: true,
  janCode: true,
})


/** zodスキーマから変換した型(バリデーション後) */
export type PackageUnitEditFormData = z.infer<typeof packageUnitEditFormSchema>

/** zodスキーマから変換した型 (入力時の型) */
export type PackageUnitEditFormInput = z.input<typeof packageUnitEditFormSchema>


/** 包装情報更新のAPIリクエスト型 */
export type UpdatePackageUnitRequest = PackageUnitEditFormData

/** 包装情報更新のAPIレスポンス型 */
export type UpdatePackageUnitResponse = {
  message: string
}


//-------------------------------------
// DELETE: 包装の削除 
//-------------------------------------

/** 包装削除のレスポンス型 */
export type DeletePackageUnitResponse = {
  message: string
}


//-------------------------------------
// POST: 告示情報の登録
//-------------------------------------

/** 告示情報登録のリクエスト型 */
export type CreateAnnounceRequest = {
  announceType: AnnounceType
  announcedDate: string
  effectiveDate: string
}

/** 告示情報登録のレスポンス型 */
export type CreateAnnounceResponse = {
  message: string
}