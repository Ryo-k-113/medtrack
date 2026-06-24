"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BaseAlertDialog } from "@/components/AlertDialog/BaseAlertDialog"

import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { useAdminPackageUnit } from "../_hooks/useAdminPackageUnit"
import { fetcher } from "@/utils/fetcher"


export const PackageUnitDeleteDialog = () => {
  const router = useRouter()
  const { token } = useSupabaseSession()
  const { drugId, packageUnitId } = useAdminPackageUnit()

  const [isDeleting, setIsDeleting] = useState(false)

  // 削除処理
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetcher({
        url: `/api/admin/drugs/${drugId}/packages/${packageUnitId}`,
        method: "DELETE",
        token,
      })
      toast.success(res.message)
      router.replace(`/admin/drugs/${drugId}`)
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex justify-end pt-2">
      <BaseAlertDialog
        trigger={
          <Button 
            variant="outline" 
            disabled={isDeleting} 
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "削除中..." : "包装を削除する"}
          </Button>
        }
        title="削除しますか？"
        description="紐づく全ての告示履歴も削除されます。この操作は取り消せません。"
        actionLabel="削除する"
        onAction={handleDelete}
        isLoading={isDeleting}
        actionClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      />
    </div>
  )
}