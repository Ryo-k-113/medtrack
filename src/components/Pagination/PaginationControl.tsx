
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight  } from "lucide-react"
import { Button } from "@/components/ui/button"


type PaginationControlProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const PaginationControl = ({
  page,
  totalPages,
  onPageChange,
}: PaginationControlProps) => {
  return (
    <div className="flex items-center gap-2">

       {/* ページ情報  */}
       <p className="text-sm text-weak px-3">
        {page} / {totalPages}ページ
      </p>

      {/* 最初のページへ */}
      <Button
        variant="outline"
        size="icon"
        aria-label="最初のページへ"
        className="h-10 w-10"
        disabled={page <= 1}
        onClick={() => onPageChange(1)}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* 前へ */}
      <Button
        variant="outline"
        size="icon"
        aria-label="前へ"
        className="h-10 w-10"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* 次へ */}
      <Button
        variant="outline"
        size="icon"
        aria-label="次へ"
        className="h-10 w-10"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* 最後のページへ */}
      <Button
        variant="outline"
        size="icon"
        aria-label="最後のページへ"
        className="h-10 w-10"
        disabled={page >= totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  )
}