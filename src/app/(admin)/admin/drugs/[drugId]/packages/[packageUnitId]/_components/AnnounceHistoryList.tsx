"use client"

import { useState } from "react"
import { EyeOff } from "lucide-react"
import { useAdminPackageUnit } from "../_hooks/useAdminPackageUnit"
import { formatDate } from "@/utils/format"
import { AnnounceTypeBadge } from "@/components/Badge/AnnounceTypeBadge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"


export const AnnounceHistoryList = () => {

  //告示情報の取得
  const { announceHistories } = useAdminPackageUnit()

  // 非表示ダイアログの対象（告示ID）
  const [inactivateTargetId, setInactivateTargetId] = useState<number | null>(null)

  return (
    <div className="border rounded-lg p-5 bg-background shadow-sm mb-4">
      <div className="border-b pb-4">
        <h3 className="font-bold">告示履歴</h3>
      </div>

      {announceHistories.length === 0 ? (
        <p className="h-[100px] flex justify-center items-center text-sm ">
          告示情報がありません
        </p>
      ) : (
        <div className="pt-4 max-h-[800px] overflow-y-auto pr-1">
          <table className="w-full border-collapse text-left">

            {/* ヘッダー */}
            <thead>
              <tr className="grid grid-cols-4 gap-2 py-2 px-4 mb-1  border-b bg-surface rounded-md">
                <th className="text-xs">告示日</th>
                <th className="text-xs">適用日</th>
                <th className="text-xs">種別</th>
                <th className="text-xs">操作 / ステータス</th>
              </tr>
            </thead>

            {/* 履歴一覧 */}
            <tbody>
              {announceHistories.map((history) => {
                // 非表示済みか判定
                const isInactive = history.publishStatus === "INACTIVE"

                // 適用日が過去か判定
                const isPastEffectiveDate =
                  !!history.effectiveDate && new Date(history.effectiveDate) < new Date()

                return (
                  <tr
                    key={history.id}
                    className="grid grid-cols-4 gap-2 p-4 border-b  items-center"
                  >
                    {/*  告示日 */}
                    <td className={cn("text-sm", isInactive && "line-through text-weak")}>
                      {formatDate(history.announcedDate) ?? "-"}
                    </td>

                    {/* 適用日 */}
                    <td className={cn("text-sm", isInactive && "line-through text-weak")}>
                      {formatDate(history.effectiveDate) ?? "-"}
                    </td>

                    {/* 告示種別 */}
                    <td>
                      {history.announceType ? (
                        <AnnounceTypeBadge
                          status={history.announceType}
                          inactive={isInactive}
                          className="rounded-md"
                        />) : "-"
                      }
                    </td>

                    {/* 非表示ボタン / 非表示済みの表記 */}
                    <td>
                      {isInactive ? (
                        <span className="flex items-center gap-1.5 text-sm text-weak">
                          <EyeOff className="h-4 w-4" />
                          非表示済み
                        </span>
                      ) : (
                        isPastEffectiveDate && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setInactivateTargetId(history.id)}
                          >
                            <EyeOff className="h-4 w-4" />
                            非表示
                          </Button>
                        )
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}