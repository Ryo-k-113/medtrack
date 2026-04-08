
//製品の区分
export type ProductType = 
  | 'ORIGINAL_PRODUCT' 
  | 'ASSOCIATE_ORIGINAL_PRODUCT' 
  | 'GENERIC_WITH_ADD' 
  | 'GENERIC_WITHOUT_ADD' 
  | 'OTHER';


//現在の出荷状況
export type CurrentShippingStatus = 
  | 'NORMAL_SHIPMENT' 
  | 'LIMITED_SHIPMENT' 
  | 'SHIPMENT_SUSPENDED';


//医薬品情報の公開・下書き
export type PublishStatus = 
| 'DRAFT' 
| 'PUBLISHED';



//包装情報の型
export type PackageUnit = { 
  name: string;
  gs1SalesCode?: string | null;   
  gs1DispensingCode?: string | null;
  hotCode?: string | null;
  janCode?: string | null;
  unifiedCode?: string | null;

  currentShippingStatus: CurrentShippingStatus;
  publishStatus: PublishStatus;

  salesTransferDate?: string | null;
  discontinuedDate?: string | null;
  transitionalMeasuresDate?: string | null;
};


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


// 新規医薬品登録の型
// 製品と各包装情報
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
  packageUnits: PackageUnit[];
};