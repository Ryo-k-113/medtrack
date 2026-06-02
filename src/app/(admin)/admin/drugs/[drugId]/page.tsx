"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AdminDrugEditPage() {
  const router = useRouter();

  return (
    <div>
      {/* タイトルと戻るボタン */}
      <div className="flex justify-between items-center pb-4  border-b">
        <h2 className="text-lg font-bold">
          医薬品名を編集
        </h2>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/drugs")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          一覧に戻る
        </Button>
      </div>

    </div> 
  ) 

}
