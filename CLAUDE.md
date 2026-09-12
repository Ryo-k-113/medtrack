# MedTrack - プロジェクトルール

## 技術スタック
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- Prisma ORM

## コーディングルール
- コンポーネントは関数コンポーネント（アロー関数）で統一
- any型の使用禁止
- route.tsを使い、Server Actionsは使用しない
- フォームはreact-hook-formを使用
- コメントは日本語で記述

## ディレクトリ構成
- src/app/ : ページ
- src/components/ui/ : shadcn/uiコンポーネント
- prisma/ : スキーマ定義とマイグレーション
- prisma/seed/ : シードデータの生成スクリプトと元データ

## コマンド
- 開発サーバー: npm run dev
- ビルド: npm run build
- スキーマ変更: npm run migrate -- --name 変更内容（開発DBへ適用しSQLを生成）
- シードデータの生成: npm run seed:build
- シードデータの投入: npm run seed（件数を絞る場合は -- --limit 200）

## 環境
- Supabaseは本番用と開発用でプロジェクトを分けている
- ローカルの .env / .env.local は開発用プロジェクトを指す
- 本番の接続情報はVercelの環境変数にのみ置く
- 本番への反映はVercelのビルド時に vercel-build が prisma migrate deploy を実行する
  （db push は使わない。スキーマ変更は必ずマイグレーションを生成する）