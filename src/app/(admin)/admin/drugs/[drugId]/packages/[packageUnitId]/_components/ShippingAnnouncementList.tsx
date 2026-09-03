"use client"

import { useState } from "react"
import { useAdminPackageUnit } from "../_hooks/useAdminPackageUnit"
import { BaseTable } from "@/components/Table/BaseTable"
import { ShippingAnnouncementColumns } from "./ShippingAnnouncementColumns"
import { InactivateAnnounceDialog } from "./InactivateAnnounceDialog"
import { AnnounceEditDialog } from "./AnnounceEditDialog"
import type { ShippingAnnouncement } from "@/types/drug"


export const ShippingAnnouncementList = () => {
  const { shippingAnnouncements } = useAdminPackageUnit()

  // 非表示ダイアログの対象（告示ID）
  const [inactivateTargetId, setInactivateTargetId] = useState<number | null>(null)

  // 編集ダイアログの対象
  const [editTarget, setEditTarget] = useState<ShippingAnnouncement | null>(null)

  // テーブルのカラム
  const columns = ShippingAnnouncementColumns({
    onEdit: (history) => setEditTarget(history),
    onInactivate: (id) => setInactivateTargetId(id),
  })

  return (
    <div className="border rounded-lg p-5 bg-background shadow-sm mb-4">
      <div className="border-b pb-4">
        <h3 className="font-bold">告示履歴</h3>
      </div>

      {/* 告示履歴のテーブル */}
      <div className="pt-4 max-h-[800px] overflow-y-auto pr-1">
        <BaseTable 
          columns={columns} 
          data={shippingAnnouncements} 
          emptyContent="履歴がありません"
          className="border-x-0 rounded-none"
        />
      </div>

      {/* 非表示化のダイアログ */}
      <InactivateAnnounceDialog
        isOpen={inactivateTargetId !== null}
        onClose={() => setInactivateTargetId(null)}
        announceId={inactivateTargetId}
      />

      {/* 編集ダイアログ */}
      <AnnounceEditDialog
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        history={editTarget}
      />
    </div>
  )
}
