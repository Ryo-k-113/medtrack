
export type DrugPackageUnit = {
  //包装の情報
  id: string;
  name: string;
  gs1SalesCode: string | null; 
  gs1DispensingCode: string | null; 
  hotCode: string | null;
  janCode: string | null;
  unifiedCode: string | null;
  currentShippingStatus: string;
  salesTransferDate: string | null;
  discontinuedDate: string | null;
  transitionalMeasuresDate: string | null;
  
  //製品の情報
  Drug: {
    id: string;
    name: string;
    yjCode: string | null;
    drugPriceListingCode: string | null;
    price: number | null;
    isSelectMedical: boolean | null;
    sAuthorizedGeneric: boolean | null;
    packageInsertUrl: string | null;
    productType: string;
    
    Unit: {
      id: string;
      name: string;
    }
    GenericName: {
      id: string;
      name: string;
    };
    SalesCompany: {
      id: string;
      name: string;
    } ;
    ManufacturingCompany: {
      id: string;
      name: string;
    } ;
  };
};