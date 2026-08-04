"use client"
import { ColumnDef } from "@tanstack/react-table"
import { DrugPackageUnit } from "../_types/DrugPackageUnit"
import { ShippingStatusBadge } from "@/components/Badge/ShippingStatusBadge"



//一覧表示のテーブル項目
export const drugsColumns: ColumnDef<DrugPackageUnit>[] = [
  { accessorKey: "Drug.name", 
    size: 180, 
    header: "医薬品名" 
  },

  { accessorKey: "name", 
    size: 180, 
    header: "包装単位",
  },

  { accessorKey: "currentShippingStatus", 
    size: 90, 
    header: () => <p className="text-center">出荷状況</p>,
    cell: ({ row }) => (
      <p className="text-center">
        <ShippingStatusBadge
          status={row.original.currentShippingStatus}
          className="rounded-md"
        />
      </p>
    )
  },

  { accessorKey: "unifiedCode", 
    size: 120, 
    header: () => <p className="text-center">統一商品コード</p>, 
    cell: ({ row }) => (
      <p className="text-center">
        {row.original.unifiedCode}
      </p>
    ),
  },

  { accessorKey: "gs1SalesCode", 
    size: 140, 
    header: () => <p className="text-center">販売GS1コード</p>,
    cell: ({ row }) => (
      <p className="text-center">
        {row.original.gs1SalesCode}
      </p>
    ),
  },

  { accessorKey: "Drug.SalesCompany.name",
    size: 120, 
    header: "販売会社",
  },
]