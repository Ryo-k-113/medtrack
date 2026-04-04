"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DrugPackageUnit } from "../_types/DrugPackageUnit"

type StatusType = "NORMAL_SHIPMENT" | "LIMITED_SHIPMENT" | "SHIPMENT_SUSPENDED";

//出荷ステータス一覧
export const statusLabelMap: Record<StatusType, string> = {
  NORMAL_SHIPMENT: "通常出荷",
  LIMITED_SHIPMENT: "限定出荷",
  SHIPMENT_SUSPENDED: "出荷停止", 
};

//ステータスによる色分け
export const statusColorMap: Record<StatusType, string> = {
  NORMAL_SHIPMENT: "text-status-normal-foreground border-status-normal bg-status-normal",
  LIMITED_SHIPMENT: "text-status-limited-foreground border-status-limited bg-status-limited",
  SHIPMENT_SUSPENDED: "text-status-stop-foreground border-status-stop bg-status-stop",
};

//一覧表示のテーブル項目
export const drugsColumns: ColumnDef<DrugPackageUnit>[] = [
  { accessorKey: "Drug.name", header: "医薬品名" },
  { accessorKey: "name", header: "包装単位" },
  { accessorKey: "currentShippingStatus", header: "出荷状況",
    cell: ({ row }) => {
      const status = row.getValue("currentShippingStatus") as StatusType;
      const label = statusLabelMap[status] 
      const statusColor = statusColorMap[status] 
      //ステータスに合わせたバッジを表示
      return( 
        <Badge variant="outline" className={statusColor}>{label}</Badge>
      )
    }
  },
  { accessorKey: "gs1SalesCode", header: "販売包装用GS1コード" },
  { accessorKey: "unifiedCode", header: "統一商品コード" },
  { accessorKey: "Drug.SalesCompany.name", header: "販売会社" },
  { accessorKey: "Drug.ManufacturingCompany.name", header: "製造会社" },
]