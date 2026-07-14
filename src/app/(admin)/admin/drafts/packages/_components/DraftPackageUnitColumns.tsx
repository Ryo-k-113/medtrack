import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/utils/format"
import { ShippingStatusBadge } from "@/components/Badge/ShippingStatusBadge"
import type { DraftPackageUnit } from "@/types/admin/draft"



type ColumnsProps = {
  onEdit: (packageUnit: DraftPackageUnit) => void
  onPublish: (id: number) => void
}

export const DraftPackageUnitColumns = ({
  onEdit,
  onPublish,
}: ColumnsProps): ColumnDef<DraftPackageUnit>[] => [
  {
    accessorKey: "name",
    header: "包装名 / 医薬品名",
    size: 300,
    meta: {
      sticky: true,
    },
    cell: ({ row }) => (
      <div>
        <p className="text-sm pb-1">{row.original.name}</p>
        <p className="text-xs mt-1">
          {row.original.Drug.name}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "currentShippingStatus",
    header: () => <p className="text-center">出荷状況</p>,
    size: 110,
    cell: ({ row }) => (
      <p className="text-center">
        <ShippingStatusBadge
          status={row.original.currentShippingStatus}
          className="rounded-md"
        />
      </p>
    ),
  },
  {
    accessorKey: "gs1SalesCode",
    header: () => <p className="text-center">販売GS1</p>,
    size: 120,
    cell: ({ row }) => (
      <p className={`text-xs text-center ${!row.original.gs1SalesCode && "text-weak"}`}>
        {row.original.gs1SalesCode ?? "未入力"}
      </p>
    ),
  },
  {
    accessorKey: "gs1DispensingCode",
    header: () => <p className="text-center">調剤GS1</p>,
    size: 120,
    cell: ({ row }) => (
      <p className={`text-xs text-center ${!row.original.gs1DispensingCode && "text-weak"}`}>
        {row.original.gs1DispensingCode ?? "未入力"}
      </p>
    ),
  },
  {
    accessorKey: "unifiedCode",
    header: () => <p className="text-center">統一商品コード</p>,
    size: 130,
    cell: ({ row }) => (
      <p className={`text-xs text-center ${!row.original.unifiedCode  && "text-weak"}`}>
        {row.original.unifiedCode ?? "未入力"}
      </p>
    ),
  },
  {
    accessorKey: "hotCode",
    header: () => <p className="text-center">HOTコード</p>,
    size: 120,
    cell: ({ row }) => (
      <p className={`text-xs text-center ${!row.original.hotCode && "text-weak"}`}>
        {row.original.hotCode ?? "未入力"}
      </p>
    ),
  },
  {
    accessorKey: "janCode",
    header: () => <p className="text-center">JANコード</p>,
    size: 120,
    cell: ({ row }) => (
      <p className={`text-xs text-center ${!row.original.janCode && "text-weak"}`}>
        {row.original.janCode ?? "未入力"}
      </p>
    ),
  },
  {
    accessorKey: "discontinuedDate",
    header: () => <p className="text-center">販売中止日</p>,
    size: 110,
    cell: ({ row }) => (
      <p className={`text-xs text-center ${!row.original.discontinuedDate && "text-weak"}`}>
        {formatDate(row.original.discontinuedDate) ?? "ー"}
      </p>
    ),
  },
  {
    accessorKey: "salesTransferDate",
    header: () => <p className="text-center">販売移管日</p>,
    size: 120,
    cell: ({ row }) => (
      <p className={`text-xs text-center ${!row.original.salesTransferDate && "text-weak"}`}>
        {formatDate(row.original.salesTransferDate) ?? "ー"}
      </p>
    ),
  },
  {
    id: "actions",
    header: "",
    size: 140,
    cell: ({ row }) => (
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(row.original)}
        >
          編集
        </Button>
        <Button
          size="sm"
          variant="accent"
          onClick={() => onPublish(row.original.id)}
          className="font-bold"
        >
          公開
        </Button>
      </div>
    ),
    
  },
]
