"use client"

import { useAdminPackageUnit } from "../_hooks/useAdminPackageUnit"
import { formatDate } from "@/utils/format"
import { AnnounceTypeBadge } from "@/app/(admin)/admin/_components/AnnounceTypeBadge"


export const AnnounceHistoryList = () => {
  const { announceHistories } = useAdminPackageUnit()

  return (
    <div className="border rounded-lg p-5 bg-background shadow-sm mb-4">
      <div className="border-b pb-4">
        <h3 className="font-bold">告示履歴</h3>
      </div>

      {announceHistories.length === 0 ? (
        <p className="text-sm text-center py-4">
          告示履歴がありません
        </p>
      ) : (
        <div className="pt-4">

          <table className="w-full border-collapse text-left">
            {/* ヘッダー */}
            <thead>
              <tr className="grid grid-cols-4 gap-2 py-2 px-4  mb-1  border-b bg-surface rounded-md">
                <th className="text-xs">告示日</th>
                <th className="text-xs">実施日</th>
                <th className="text-xs">種別</th>
              </tr>
            </thead>

            {/* 履歴一覧 */}
            <tbody>
              {announceHistories.map((history) => (
                <tr
                  key={history.id}
                  className="grid grid-cols-4 gap-2 p-4 border-b last:border-b-0 items-center"
                > 
                  {/*  告示日 */}
                  <td className="text-sm">
                    {formatDate(history.announcedDate) ?? "-"}
                  </td>

                  {/* 実施日 */}
                  <td className="text-sm">
                    {formatDate(history.effectiveDate) ?? "-"}
                  </td>

                  {/* 告示種別 */}
                  <td>
                    {history.announceType ? (
                      <AnnounceTypeBadge
                        status={history.announceType}
                        className="rounded-md"
                      />) : "-"
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}