import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"

/**
 * 確認用の一覧をCSVで書き出す（Excelで開けるようBOMを付ける）
 * 出力先は prisma/seed/raw/ 以下（gitの管理外）とする
 */
export const writeReviewCsv = (file: string, header: string[], rows: string[][]) => {
  const escape = (value: string) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value)
  const lines = [header, ...rows].map((row) => row.map(escape).join(","))
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, `﻿${lines.join("\r\n")}\r\n`)
}
