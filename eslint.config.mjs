import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

// Next.js 16 で next lint が無くなったため、ESLint の設定ファイル（flat config）で指定する
// 内容はこれまでの .eslintrc.json（next/core-web-vitals と next/typescript）と同じ
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
])
