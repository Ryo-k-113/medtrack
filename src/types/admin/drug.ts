import { z } from "zod"
import type { Drug, PackageUnit} from "@/types/drug"
import type {  ProductType, CurrentShippingStatus, PublishStatus,AnnounceType } from "@prisma/client"
import { packageUnitFormSchema } from "@/app/(admin)/admin/drugs/_schemas/drug"


// 告示履歴の型
export type AnnounceHistory = {
  id: number
  announcedDate: string | null
  effectiveDate: string | null
  announceType: AnnounceType | null
  PackageUnitId: number
}



//-------------------------------------
// 医薬品一覧ページ GETレスポンス型
//-------------------------------------
export type PublishedPackageUnitResponse = {
  id: number;
  name: string;
  gs1SalesCode: string | null; 
  unifiedCode: string | null;  
  currentShippingStatus: CurrentShippingStatus; 

  // selectで取得するDrugの型
  Drug: {
    id: number;
    name: string;
    yjCode: string;
    productType: ProductType | null; 

    GenericName: {
      id: number;
      name: string;
    }; 
    SalesCompany: {
      id: number;
      name: string;
    };
  };
};

// APIが返す全体の型
export type GetPublishedPackageUnitsResponse = {
  packageUnits: PublishedPackageUnitResponse[];
};


//-------------------------------------
// 新規医薬品登録のPOSTリクエスト型・レスポンス型
//-------------------------------------
export type CreateDrugRequest = { 
  name: string;
  price?: number | null; 
  drugPriceListingCode?: string | null;
  yjCode: string; 
  isSelectMedical?: boolean | null;
  isAuthorizedGeneric?: boolean | null;
  packageInsertUrl?: string | null;
  productType?: ProductType | null;

  GenericNameId: number;
  UnitId: number;
  ManufacturingCompanyId: number;
  SalesCompanyId: number;

  // -- PackageUnits 各包装情報 --
  packageUnits: CreatePackageUnitRequest[];
};

// 包装情報のリクエスト型
export type CreatePackageUnitRequest = {
  // 必須項目
  name: string;
  currentShippingStatus: CurrentShippingStatus;
  publishStatus: PublishStatus;

  // 任意項目
  gs1SalesCode?: string | null;
  gs1DispensingCode?: string | null;
  hotCode?: string | null;
  janCode?: string | null;
  unifiedCode?: string | null;
  salesTransferDate?: string | null;
  discontinuedDate?: string | null;
  transitionalMeasuresDate?: string | null;
}


// 医薬品登録のレスポンス型
export type CreateDrugResponse = {
  message: string
  data: Drug & {
    PackageUnits: PackageUnit[]
  }
}

//-------------------------------------
// 製品編集ページ GETレスポンス型
//-------------------------------------
export type DrugEditPackageUnitCard = Pick<PackageUnit,
  "id" |
  "name" |
  "gs1SalesCode" |
  "unifiedCode" |
  "currentShippingStatus" |
  "publishStatus"
>

export type DrugEditResponse = {
  data: Drug & {
    PackageUnits: DrugEditPackageUnitCard[]
  }
}

// -------------------------------------
// 製品編集  PUTリクエスト・レスポンス型
// -------------------------------------
export type UpdateDrugRequest = {
  // 必須項目
  name: string
  yjCode: string
  GenericNameId: number
  UnitId: number
  ManufacturingCompanyId: number
  SalesCompanyId: number
  // 任意項目
  price?: number | null
  drugPriceListingCode?: string | null
  isSelectMedical?: boolean | null
  isAuthorizedGeneric?: boolean | null
  packageInsertUrl?: string | null
  productType?: ProductType | null
}

export type UpdateDrugResponse = {
  message: string
  data: Drug
}


//-------------------------------------
// 製品削除 DELETEレスポンス型
//-------------------------------------
export type DeleteDrugResponse = {
  message: string
}


//-------------------------------------
// 製品に包装追加 POSTリクエスト・レスポンス型
//-------------------------------------
export type AddPackageUnitRequest = CreatePackageUnitRequest

export type AddPackageUnitResponse = {
  message: string
  data: PackageUnit
}


//-------------------------------------
// 包装編集ページ GETレスポンス型
//-------------------------------------
export type PackageUnitDetailResponse = {
  data: PackageUnit & {
    AnnounceHistories: AnnounceHistory[]
    Drug: Pick<Drug, "id" | "name" | "yjCode"> & {
      GenericName: { id: number, name: string }
      SalesCompany: {id: number, name: string }
      ManufacturingCompany: {id: number, name: string }
    }
  }
}

//-------------------------------------
// PUT: 包装情報の更新
//-------------------------------------

// * 包装編集フォームのスキーマ */
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
  data: PackageUnit
}


//-------------------------------------
// 包装の削除 DELETEレスポンス型
//-------------------------------------
export type DeletePackageUnitResponse = {
  message: string
}


//-------------------------------------
// 出荷情報履歴の作成 POSTリクエスト・レスポンス型
//-------------------------------------
export type CreateAnnounceRequest = {
  announceType: AnnounceType
  announcedDate: string
  effectiveDate: string
}

export type CreateAnnounceResponse = {
  message: string
  data: AnnounceHistory
}