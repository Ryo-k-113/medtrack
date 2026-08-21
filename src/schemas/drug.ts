import { z } from "zod";
import { CurrentShippingStatus, PublishStatus, ProductType } from "@prisma/client"


//----------------------------
//  共通部品
//----------------------------
/** 固定桁数コードフィールド（任意・null変換）*/
const optionalCodeField = (num: number) =>
  z.union([
    z.literal(""),
    z.string().length(num, `${num}桁で入力してください`),
  ]).transform((val) => (val === "" ? null : val))

/** IDフィールド（select用・必須）*/
const requiredIdField = (message: string) =>
  z.string()
    .min(1, message)
    .transform((val) => Number(val))


//----------------------------
//  医薬品フォームのベーススキーマ
//----------------------------

// 包装情報のスキーマ
export const packageUnitFormSchema = z.object({
  // 必須項目
  publishStatus: z.enum(PublishStatus, {
    message: "ステータスが不正です" 
  }),

  name: z.string().min(1, "包装名は必須です"),

  currentShippingStatus: z
    // 入力値は ProductType または "" を許容
    .union([z.enum(CurrentShippingStatus), z.literal("")])
    // 送信時に空文字ならエラー
    .refine((val) => val !== "", {
      message: "出荷状況を選択してください",
    }),

  unifiedCode: z
  .string()
  .min(1, "統一コードを入力してください") 
  .length(9, "9桁で入力してください"),

  // 任意項目
  gs1DispensingCode: optionalCodeField(14), 
  gs1SalesCode: optionalCodeField(14), 
  hotCode: optionalCodeField(13), 
  janCode: optionalCodeField(13), 
  discontinuedDate: z.date().nullable().optional(),
  salesTransferDate: z.date().nullable().optional(),
});


// 医薬品フォームのスキーマ(製品と包装をまとめたもの)
export const drugFormSchema = z.object({
  //  必須項目
  name: z.string().min(1, "医薬品名は必須です"),

  yjCode: z.string()
    .min(1, "YJコードは必須です")
    .length(12, "12桁で入力してください"),
  
  genericNameId: requiredIdField("一般名を選択してください"),   
  unitId: requiredIdField("単位を選択してください"),      
  salesCompanyId: requiredIdField("販売会社を選択してください"),  
  manufacturingCompanyId: requiredIdField("製造会社を選択してください"), 

  productType: z
    // 入力値は ProductType または "" を許容
    .union([z.enum(ProductType), z.literal("")])
    // 送信時に空文字ならエラー
    .refine((val) => val !== "", {
      message: "区分を選択してください",
    }),

  //  任意項目
  packageInsertUrl: z.string().transform((val) => (val === "" ? null : val)),
  drugPriceListingCode: optionalCodeField(12),
  
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
  transitionalMeasuresDate: z.date().nullable().optional(),

  // 包装情報
  packageUnits: z
    .array(packageUnitFormSchema)
    .min(1, "1つの包装情報を追加してください"),
});

