"use client"

import { useState } from "react"
import { toast } from "sonner"
import { DataTable } from "@/components/Table/DataTable"
import { DataTableSkeleton } from "@/components/Table/DataTableSkeleton"
import { DraftPackageUnitEditDialog } from "./DraftPackageUnitEditDialog"
import { DraftPackageUnitColumns } from "./DraftPackageUnitColumns"
import { useAdminDraftPackageUnits } from "../_hooks/useAdminDraftPackageUnits"
import { fetcher } from "@/utils/fetcher"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import type { DraftPackageUnit } from "@/types/admin/draft"


export const DraftPackageUnitList = () => {
  const { token } = useSupabaseSession()

  // 下書きの包装一覧を取得
  const { draftPackageUnits, isLoading, error, mutate } = useAdminDraftPackageUnits()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<DraftPackageUnit | null>(null)

  // 公開処理の状態管理
  const [isPublishing, setIsPublishing] = useState(false)
  
  // 公開処理
  const handlePublish = async (id: number) => {
    if (isPublishing) return
    setIsPublishing(true)
    try {
      const res = await fetcher({
        url: `/api/admin/drafts/packages/${id}`,
        method: "PATCH",
        token,
      })
      toast.success( 
        <div className="flex flex-col gap-0.5">
          <span className="font-bold">{res.data.name}</span>
          <span className="text-xs">（{res.data.Drug.name}）を</span>
          <span>公開しました</span>
        </div>
      )
      await mutate()
    } catch {
      toast.error(error.message)
    } finally {
      setIsPublishing(false)
    }
  }

  // テーブルのカラム
  const columns = DraftPackageUnitColumns({
    onEdit: (packageUnit) => {
      setEditTarget(packageUnit)
      setIsEditOpen(true)
    },
    onPublish: (packageUnitId) => handlePublish(packageUnitId),
    isPublishing,
  })

  // ローディング表示
  if (isLoading) return <DataTableSkeleton />
  if (error) return <div>エラーが発生しました</div>

  return (
    <>  
      {/* 下書きの包装一覧テーブル */}
      <DataTable
        columns={columns}
        data={draftPackageUnits}
        pinnedColumns={{
          left: ["name"],  // 包装名を左端に固定  
          right: ["actions"], // actionsカラムを右端に固定
        }}
      />

      {/* 編集ダイアログ */}
      <DraftPackageUnitEditDialog
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false)
          setEditTarget(null)
        }}
        packageUnit={editTarget}
        onSuccess={mutate}
      />
    </>
  )
}
