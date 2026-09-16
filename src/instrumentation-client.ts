// ブラウザ側のSentryの設定
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://1f4222847d71a24d4cd95f932680758c@o4512097665089536.ingest.us.sentry.io/4512097687961600",

  // 本番でのみ送信する（ローカル・プレビューのエラーは記録しない）
  enabled: process.env.NEXT_PUBLIC_VERCEL_ENV === "production",

  // Sentry上で環境を区別するための名前
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",

  // パフォーマンス計測は10件に1件のみ（無料枠を使い切らないため）
  tracesSampleRate: 0.1,

  dataCollection: {
    // 利用者の情報とHTTPのリクエスト内容は送らない
    userInfo: false,
    httpBodies: [],
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
