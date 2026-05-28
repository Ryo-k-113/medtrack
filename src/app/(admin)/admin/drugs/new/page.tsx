"use client"

import * as React from "react"
import { DrugCreateForm } from "../_components/DrugCreateForm"

export default function DrugCreatePage() {
  return (
    <div>
      {/* ページタイトル */}
      <div className="border-b-2 border-surface">
        <h2 className="pb-2 text-xl font-bold text-foreground">
          医薬品の新規登録
        </h2>
      </div>

      {/* 医薬品の新規登録フォーム */}
      <DrugCreateForm />
    </div>
  )
}

