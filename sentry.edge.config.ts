// Edge側（middlewareなど）のSentryの設定
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://1f4222847d71a24d4cd95f932680758c@o4512097665089536.ingest.us.sentry.io/4512097687961600",

  // 本番でのみ送信する（ローカル・プレビューのエラーは記録しない）
  enabled: process.env.VERCEL_ENV === "production",

  // Sentry上で環境を区別するための名前
  environment: process.env.VERCEL_ENV ?? "development",

  // パフォーマンス計測は行わない（エラーの記録のみに絞り、送信量を抑える）
  tracesSampleRate: 0,

  dataCollection: {
    // 利用者の情報とHTTPのリクエスト内容は送らない
    userInfo: false,
    httpBodies: [],
  },
});
