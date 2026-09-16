"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

/**
 * 画面の描画中に発生したエラーの受け皿
 * ルートレイアウトごと置き換わるため、最低限の表示のみ行う
 */
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Sentryへ送る（本番以外では送信されない）
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ja">
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        <div
          style={{
            display: "flex",
            minHeight: "100svh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "18px", fontWeight: "bold" }}>
            エラーが発生しました
          </p>
          <p style={{ fontSize: "14px", color: "#555" }}>
            時間をおいて、もう一度お試しください。
          </p>
          <a
            href="/"
            style={{ fontSize: "14px", color: "#2563eb", textDecoration: "underline" }}
          >
            トップページへ戻る
          </a>
        </div>
      </body>
    </html>
  );
}
