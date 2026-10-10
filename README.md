# MedTrack

## はじめに

このアプリは、医療用医薬品の出荷状況を **包装単位** で確認できる、**薬局や病院での発注・在庫管理** のための Webアプリです。
 
## 概要

https://medtrack.jp

このアプリは、医薬品の出荷状況を **発注や在庫確認の場面ですぐ確かめたい** と考えている医療機関の方に、  
出荷状況がメーカーごとの告知に散らばっていて、情報が追いにくいという課題を、  **包装ごとの出荷状況をひとつの画面で確認できる**  Webアプリです。


https://github.com/user-attachments/assets/dd9f8dad-3209-4d5e-b599-e36eb5bd5289




| <img width="2856" height="1582" alt="トップページ" src="https://github.com/user-attachments/assets/dc3dd81a-15d8-4d9a-85f2-1435b8c606e2" />| <img width="2864" height="1594" alt="検索結果" src="https://github.com/user-attachments/assets/6bd933cb-c897-4e1d-94e8-6e9cd2a02c24" />| <img width="2884" height="3567" alt="包装詳細ページ" src="https://github.com/user-attachments/assets/54e1d838-3dd5-4bf0-90a9-cc4e149fc76f" />|
| :---: | :---: | :---: |
| **トップページ** | **検索結果** | **包装詳細** | 

## 主要機能
- **医薬品の検索**: 製品名・成分名・YJ・GS1・統一商品コードで検索
- **包装単位の出荷状況**: 同じ製品でも包装ごとに違う出荷状況を、色とアイコンで表示
- **告知の履歴と予定**: 告知日・適用日の履歴と、販売中止・販売移管の予定を表示
- **医薬品の更新情報**: その日に出た告知の一覧を、カレンダーで日付を選択し確認
- **医薬品のブックマーク**: マイページでブックマークした医薬品を表示
  


## システム構成図

<img width="3320" height="1440" alt="システム構成図" src="https://github.com/user-attachments/assets/6cfb6dae-934b-45d1-9abd-ed32a52bacf9" />

## 使用技術

### フロントエンド

- **言語**: TypeScript
- **フレームワーク**: [Next.js 16](https://nextjs.org/) (App Router)
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [shadcn/ui](https://ui.shadcn.com/)
- **状態管理/データフェッチ**:
  - [SWR](https://swr.vercel.app/ja): データフェッチと状態管理

### バックエンド

- **言語**: TypeScript
- **フレームワーク**: [Next.js 16](https://nextjs.org/) (Route Handlers)
- **データベース**: PostgreSQL ([Supabase Database](https://supabase.com/docs/guides/database/overview))
- **ORM**: [Prisma](https://www.prisma.io/)
- **認証**: [Supabase Auth](https://supabase.com/docs/guides/auth)
- **定期実行**: [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

### 開発環境・インフラ

- **IDE**: Visual Studio Code
- **ホスティング**: Vercel
- **バージョン管理**: Git, GitHub
- **デザイン**: Figma

### 主要なライブラリ

- [React Hook Form](https://react-hook-form.com/): フォーム管理
- [Zod](https://zod.dev/): バリデーション
- [TanStack Table](https://tanstack.com/table): テーブル表示
- [date-fns](https://date-fns.org/): 日付の計算と表示
- [ESLint](https://eslint.org/): コード品質管理
- [sonner](https://sonner.emilkowal.ski/): 通知

## データベース設計

<img width="1714" height="1134" alt="ER図" src="https://github.com/user-attachments/assets/9c828b7f-f309-4d9b-a9cc-521c6dd3e529" />


## 開発環境のセットアップ

### 前提条件

- Node.js 22.x以上
- npm
- Git

### インストール手順

1. リポジトリをクローン:

```bash
git clone https://github.com/Ryo-k-113/medtrack.git
cd medtrack
```

2. 依存関係をインストール:

```bash
npm install
```

3. 環境変数を設定:

   `.env`ファイルを作成し、以下の環境変数を設定してください：

   ```bash
   # Supabase設定
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

   # データベース設定
   DATABASE_URL=your_database_url_here
   DIRECT_URL=your_direct_url_here

   # サイトのURL
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   **注意**: これらの値はSupabaseプロジェクトの設定から取得できます。
   - Supabase URL: Project Settings > API > Project URL
   - Supabase Anon Key: Project Settings > API > Project API keys > anon public
   - Database URL / Direct URL: ダッシュボード上部の「Connect」> Connection string

4. データベースを準備:

```bash
npm run migrate:deploy
npm run seed
```

5. 開発サーバーを起動:

```bash
npm run dev
```

6. ブラウザで http://localhost:3000 を開いてアプリにアクセス
