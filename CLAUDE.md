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
- prisma/ : スキーマ定義

## コマンド
- 開発サーバー: npm run dev
- DBマイグレーション: npm run prisma:push:dev
- ビルド: npm run build