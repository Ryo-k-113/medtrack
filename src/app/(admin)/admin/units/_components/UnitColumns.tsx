import { createColumnHelper } from "@tanstack/react-table"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Unit } from "@/types/admin/unit"

type ColumnsProps = {
  onEdit: (unit: Unit) => void
}

const columnHelper = createColumnHelper<Unit>()

// 一覧表示のテーブル項目
export const UnitColumns = ({
  onEdit
}: ColumnsProps) => [
  columnHelper.accessor("id", {
    header: () => <div className="text-right">ID</div>,
    size: 30,
    minSize: 30,
    maxSize: 30,
    cell: (info) => (
      <div className="text-right">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("name", {
    header: "規格単位",
    size: 500,
    cell: (info) => (
      <div className="w-full">{info.getValue()}</div>
    ),
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    size: 100,
    minSize: 100,
    maxSize: 100,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="h-8 w-8 md:h-9 md:w-auto md:p-4"
          onClick={() => onEdit(row.original)}
        >
          <Edit className="h-4 w-4" />
          <span className="hidden md:inline ml-2 text-sm">編集する</span>
        </Button>
      </div>
    ),
  }),
]
