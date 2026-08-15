"use client"
import { ColumnDef } from "@tanstack/react-table"
import { DrugPackageUnit } from "../_types/DrugPackageUnit"
import { ShippingStatusBadge } from "@/components/Badge/ShippingStatusBadge"
import { ProductTypeBadge } from "@/components/Badge/ProductTypeBadge"
import { BaseDropdown } from "@/components/Dropdown/BaseDropdown"
import { Button } from "@/components/ui/button"
import { Ellipsis, FileEdit, Package } from "lucide-react"
import { cn } from "@/lib/utils"


type ColumnsProps = {
  onEditDrug: (packageUnit: DrugPackageUnit) => void
  onEditPackageUnit: (packageUnit: DrugPackageUnit) => void
}

//一覧表示のテーブル項目
export const drugsColumns = ({
  onEditDrug,
  onEditPackageUnit,
}: ColumnsProps): ColumnDef<DrugPackageUnit>[] => [
  { accessorKey: "Drug.productType",
    size: 60,
    header: () => <p className="text-center">区分</p>,
    cell: ({ row }) => (
      <p className="flex justify-center">
        <ProductTypeBadge type={row.original.Drug.productType} />
      </p>
    )
  },

  { accessorKey: "Drug.name",
    size: 180,
    header: "医薬品名"
  },

  { accessorKey: "name", 
    size: 160, 
    header: "包装単位",
  },
  { accessorKey: "Drug.GenericName.name",
    size: 180, 
    header: "成分名",
  },

  { accessorKey: "currentShippingStatus", 
    size: 100, 
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
    size: 140, 
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

  { id: "actions",
    header: "",
    size: 60,
    cell: ({ row }) => (
      <BaseDropdown
        className="w-[180px]"
        trigger={
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-8 w-8 bg-white",
              "opacity-0 group-hover/row:opacity-100",
              "data-[state=open]:opacity-100",
              "transition-opacity duration-150",
            )}
          >
            <Ellipsis className="h-4 w-4" />
          </Button>
        }
        items={[
          {
            label: "医薬品ページ",
            icon: <FileEdit className="h-4 w-4 mr-1" />,
            onClick: () => onEditDrug(row.original),
          },
          {
            label: "包装ページ",
            icon: <Package className="h-4 w-4 mr-1" />,
            onClick: () => onEditPackageUnit(row.original),
          },
        ]}
      />
    )
  },
]
