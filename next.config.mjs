import { withSentryConfig } from '@sentry/nextjs/config';

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withSentryConfig(nextConfig, {
  org: "medtrack-ua",

  project: "medtrack",

  // ソースマップの送信結果はCIのログにのみ出す
  silent: !process.env.CI,

  // エラー箇所を元のコードで追えるよう、広めにソースマップを送る
  widenClientFileUpload: true,

  sourcemaps: {
    // 認証トークンがある環境でのみ送る（ローカルのビルドでは送らない）
    disable: !process.env.SENTRY_AUTH_TOKEN,
    // 送信後は公開ディレクトリに残さない
    deleteSourcemapsAfterUpload: true,
  },

  // Sentryへの利用統計の送信は行わない
  telemetry: false,

  // webpack向けの設定（定期実行の監視・デバッグ用ログの除去）はTurbopackのビルドでは効かないため置かない
  // 定期実行の状況は管理画面のバッチ履歴で確認する
});
