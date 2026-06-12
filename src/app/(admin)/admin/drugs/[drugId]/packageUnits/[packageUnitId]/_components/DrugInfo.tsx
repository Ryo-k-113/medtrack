"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminPackageUnit } from "../_hooks/useAdminPackageUnit"

export const DrugInfo = () => {
  const { drug, isLoading } = useAdminPackageUnit()

  if(isLoading) return <div>読み込み中...</div>
  if (!drug) return <div>製品が見つかりません</div>

  const infoItems = [
    { label: "製品名", value: drug.name },
    { label: "YJコード", value: drug.yjCode },
    { label: "成分名", value: drug.GenericName.name },
    { label: "販売会社", value: drug.SalesCompany.name  },
    { label: "製造会社", value: drug.ManufacturingCompany.name },
  ];

  return (
    <Card className="w-full max-w-2xl shadow-sm border">
      <CardHeader className="">
        <CardTitle className="text-md font-bold pb-4 border-b">製品情報</CardTitle>
      </CardHeader>

      <CardContent className="py-2">
        <div className="flex flex-col text-sm"> 
          {infoItems.map((item, index) => {
            // 最後の項目
            const isLast = index === infoItems.length - 1;

            return (
              <div
                key={item.label}
                className={`grid grid-cols-4 py-3 items-center ${
                  isLast ? "" : "border-b"
                }`}
              >
                {/* ラベル */}
                <span className="">{item.label}</span>

                {/* データ */}
                <span className="col-span-3 text-end break-all">
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}

