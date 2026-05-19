
import type {  ProductType, CurrentShippingStatus, PublishStatus } from "@prisma/client"

//包装情報の型
export type PackageUnit = {
  id: number;
  name: string;
  gs1SalesCode: string | null;
  gs1DispensingCode: string | null;
  hotCode: string | null;
  janCode: string | null;
  unifiedCode: string | null;
  currentShippingStatus: CurrentShippingStatus;
  publishStatus: PublishStatus;
  salesTransferDate: string | null;
  discontinuedDate: string | null;
  transitionalMeasuresDate: string | null;
  DrugId: number;
}

// 医薬品の型
export type Drug = {
  id: number;
  name: string;
  price: number | null;
  drugPriceListingCode: string | null;
  yjCode: string;
  isSelectMedical: boolean | null;
  isAuthorizedGeneric: boolean | null;
  packageInsertUrl: string | null;
  productType: ProductType | null;
  UnitId: number;
  GenericNameId: number;
  ManufacturingCompanyId: number;
  SalesCompanyId: number;
}

//公開済みの医薬品情報(包装)のGETレスポンス型
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


// 新規医薬品登録のリクエスト型
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

// 製薬会社のGETレスポンス型
export type CompanyResponse = {
  companies: {
    id: number
    name: string
  }[]
}

// 規格単位のGETレスポンス型
export type UnitResponse = {
  units: {
    id: number
    name: string
  }[]
}

// 成分名のGETレスポンス型
export type GenericNameResponse = {
  genericNames: {
    id: number
    name: string
  }[]
}