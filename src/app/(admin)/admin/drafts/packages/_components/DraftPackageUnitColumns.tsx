import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/utils/format"
import { ShippingStatusBadge } from "@/components/Badge/ShippingStatusBadge"
import type { DraftPackageUnit } from "@/types/admin/draft"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Ellipsis, Edit, Send } from 'lucide-react';

type ColumnsProps = {
  onEdit: (packageUnit: DraftPackageUnit) => void
  onPublish: (id: number) => void
  isPublishing: boolean
}

export const DraftPackageUnitColumns = ({
  onEdit,
  onPublish,
  isPublishing,
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
    size: 60,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isPublishing}
            className={cn(
              "h-8 w-8 border bg-white",
              "opacity-0 group-hover/row:opacity-100", 
              "data-[state=open]:opacity-100", 
              "transition-opacity duration-150",
            )}
          >
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={() => onEdit(row.original)}
            className="focus:bg-surface focus:text-foreground"
            >
            <Edit className="h-4 w-4" />
            編集する
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onPublish(row.original.id)}
            className="hover:bg-accent"
          >
            <Send className="h-4 w-4" />
            公開する
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    
  },
]
