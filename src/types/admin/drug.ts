import { z } from "zod"
import type { Drug, PackageUnit, ShippingAnnouncement } from "@/types/drug"
import type { AnnounceType, GenericName, PharmaceuticalCompany } from "@prisma/client"
import { CurrentShippingStatus } from "@prisma/client"
import {
  packageUnitFormSchema,
  drugFormSchema,
} from "@/schemas/drug"


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
/**  医薬品全体の新規登録用スキーマ */
export const createDrugFormSchema = drugFormSchema;

/** zodスキーマから変換した医薬品新規登録の入力時の型 */
export type CreateDrugFormInput = z.input<typeof createDrugFormSchema>

/** zodスキーマから変換した医薬品新規登録のバリデーション後の型 */
export type CreateDrugFormData = z.infer<typeof createDrugFormSchema>


/** 医薬品の新規登録のリクエスト型 */
export type CreateDrugRequest = CreateDrugFormData

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
/** 製品情報編集フォームのスキーマ (包装情報を除く) */
export const drugEditFormSchema = drugFormSchema.omit({
  packageUnits: true,
})

/** zodスキーマから変換した入力時の型 */
export type DrugEditFormInput = z.input<typeof drugEditFormSchema>

/** zodスキーマから変換したバリデーション後の型 */
export type DrugEditFormData = z.infer<typeof drugEditFormSchema>

/** 医薬品の更新のリクエスト型 */
export type UpdateDrugRequest = DrugEditFormData

/** 医薬品の更新のレスポンス型 */
export type UpdateDrugResponse = {
  message: string
}

// -------------------------------------
// POST: 医薬品編集 (新規包装の追加)
// -------------------------------------
/**  包装情報の新規登録用スキーマ */
export const createPackageUnitFormSchema = packageUnitFormSchema;

/** zodスキーマから変換した包装情報の入力時の型 */
export type CreatePackageUnitFormInput = z.input<typeof 
createPackageUnitFormSchema>

/** zodスキーマから変換した包装情報のバリデーション後の型 */
export type CreatePackageUnitFormData = z.infer<typeof createPackageUnitFormSchema>

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
    AnnounceHistories: ShippingAnnouncement[]
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


//-------------------------------------
// POST: 告示の非表示化（INACTIVE化）
//-------------------------------------

/** 告示の非表示化フォームのスキーマ */
export const inactivateAnnounceFormSchema = z.object({
  currentShippingStatus: z
  .union([z.enum(CurrentShippingStatus), z.literal("")])
  // 送信時に空文字ならエラー
  .refine((val) => val !== "", {
    message: "出荷状況を選択してください",
  }),
})


/** zodスキーマから変換した型 (入力時の型) */
export type InactivateAnnounceFormInput = z.input<typeof inactivateAnnounceFormSchema>

/** zodスキーマから変換した型 (バリデーション後) */
export type InactivateAnnounceFormData = z.infer<typeof inactivateAnnounceFormSchema>

/** 告示の非表示化のリクエスト型 */
export type InactivateAnnounceRequest = InactivateAnnounceFormData

/** 告示の非表示化のレスポンス型 */
export type InactivateAnnounceResponse = {
  message: string
}

//-------------------------------------
// PUT: 告示情報の登録
//-------------------------------------
/** 告示編集のリクエスト型 */
export type UpdateAnnounceRequest = Pick<ShippingAnnouncement,
  | "announcedDate"
  | "effectiveDate"
  | "announceType"
>

/** 告示編集のレスポンス型 */
export type UpdateAnnounceResponse = {
  message: string
}