import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

// Next.js 16 で next lint が無くなったため、ESLint の設定ファイル（flat config）で指定する
// 内容はこれまでの .eslintrc.json（next/core-web-vitals と next/typescript）と同じ
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // eslint-config-next 16 で新しく加わった React Compiler 向けのルール
    // 既存のコード（端末の保存値を描画後に読む処理、shadcn/ui の部品など）の見直しは別で行うため、当面は警告にとどめる
    rules: {
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
])
