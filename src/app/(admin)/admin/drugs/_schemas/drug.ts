import { z } from "zod";
import { CurrentShippingStatus, PublishStatus, ProductType } from "@prisma/client"

//----------------------------
//  新規登録用スキーマ (製品と包装)
//----------------------------
// 包装情報のスキーマ
export const packageUnitFormSchema = z.object({
  // 必須項目
  publishStatus: z.enum(PublishStatus, {
    message: "ステータスが不正です" 
  }),
  name: z.string().min(1, "包装名は必須です"),
  currentShippingStatus: z.enum(CurrentShippingStatus, {
    message: "出荷状況を選択してください" 
  }),

  // 任意項目
  gs1DispensingCode: z.union([
    z.literal(""),
    z.string().length(14, "14桁で入力してください"),
  ]).transform((val) => (val === "" ? null : val)),
  
  gs1SalesCode: z.union([
    z.literal(""),
    z.string().length(14, "14桁で入力してください"),
  ]).transform((val) => (val === "" ? null : val)),
  
  unifiedCode: z.union([
    z.literal(""),
    z.string().length(9, "9桁で入力してください"),
  ]).transform((val) => (val === "" ? null : val)),
  
  hotCode: z.union([
    z.literal(""),
    z.string().length(13, "13桁で入力してください"),
  ]).transform((val) => (val === "" ? null : val)),
  
  janCode: z.union([
    z.literal(""),
    z.string().length(13, "13桁で入力してください"),
  ]).transform((val) => (val === "" ? null : val)),

  salesTransferDate: z.date().nullable().optional(),
  discontinuedDate: z.date().nullable().optional(),
  transitionalMeasuresDate: z.date().nullable().optional(),
});


// 医薬品フォーム全体のスキーマ
export const drugFormSchema = z.object({
  //  必須項目
  name: z.string().min(1, "医薬品名は必須です"),
  yjCode: z.string()
    .min(1, "YJコードは必須です")
    .length(12, "12桁で入力してください"),

  //  任意項目
  GenericNameId: z.string().transform((val) => (val === "" ? null : Number(val))),
  UnitId: z.string().transform((val) => (val === "" ? null : Number(val))),
  packageInsertUrl: z.string().transform((val) => (val === "" ? null : val)),
  SalesCompanyId: z.string().transform((val) => (val === "" ? null : Number(val))),
  ManufacturingCompanyId: z.string().transform((val) => (val === "" ? null : Number(val))),

  drugPriceListingCode: z.union([
    z.literal(""),
    z.string().length(12, "12桁で入力してください"),
  ]).transform((val) => (val === "" ? null : val)),
  
  
  productType: z.union([
    z.literal(""),
    z.enum(ProductType)
  ]).transform((val) => (val === "" ? null : val)),
  
  price: z.preprocess(
    (val) => (val === "" ? null : val),
    z.coerce.number({
      message: "正しい数値を入力してください"
    })
    .positive("0以上の数値を入力してください")
    .multipleOf(0.01, "小数点2桁以内で入力してください")
    .nullable()
    .optional()
  ),

  isSelectMedical: z.boolean(),
  isAuthorizedGeneric: z.boolean(),

  // 包装情報
  packageUnits: z
    .array(packageUnitFormSchema)
    .min(1, "1つの包装情報を追加してください"),
});



// 型定義
// 送信時の型(transform後)
export type PackageUnitFormData = z.infer<typeof packageUnitFormSchema>;
export type DrugFormData = z.infer<typeof drugFormSchema>;

//入力時の型(transform前)
export type PackageUnitFormInput = z.input<typeof packageUnitFormSchema>
export type DrugFormInput = z.input<typeof drugFormSchema>


// ---  初期値 ---
// 包装情報
export const DEFAULT_PACKAGE_UNIT: PackageUnitFormInput = {
  publishStatus: PublishStatus.DRAFT, 
  name: "", 
  currentShippingStatus: "" as CurrentShippingStatus, 
  gs1DispensingCode: "", 
  gs1SalesCode: "",
  unifiedCode: "", 
  hotCode: "", 
  janCode: "", 
  salesTransferDate: null,
  discontinuedDate: null,
  transitionalMeasuresDate: null, 
};

// フォーム全体の初期値
export const DEFAULT_DRUG_FORM_VALUES: DrugFormInput = {
  name: "", 
  GenericNameId: "", 
  price: "" as unknown as number, 
  UnitId: "", 
  yjCode: "",
  drugPriceListingCode: "", 
  packageInsertUrl: "",
  productType: "",
  SalesCompanyId: "",
  ManufacturingCompanyId: "",
  isSelectMedical: false,
  isAuthorizedGeneric: false, 
  packageUnits: [DEFAULT_PACKAGE_UNIT],
};


//-------------------------
//  製品情報編集用スキーマ
//-------------------------
// packageUnitsを除く
export const drugEditFormSchema = drugFormSchema.omit({
  packageUnits: true,
})

// 型定義
export type DrugEditFormData = z.infer<typeof drugEditFormSchema>
export type DrugEditFormInput = z.input<typeof drugEditFormSchema>