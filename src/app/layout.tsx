import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app"


const notoSansJP = Noto_Sans_JP({
  weight: ['400','500','600','700'],
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap'
});


/** サイトの共通情報（メタデータとOGPで使い回す） */
const SITE_URL = "https://medtrack.jp"
const SITE_NAME = "MedTrack"
const SITE_TITLE = "MedTrack | 医薬品の出荷状況を検索"
const SITE_DESCRIPTION =
  "医薬品の出荷状況を包装単位で調べられるサイトです。製品名・成分名のほか、GS1コードや統一商品コードからも検索できます。通常出荷・限定出荷・出荷停止・販売中止がひと目でわかります。"

export const metadata: Metadata = {
  // OGPの画像などを絶対URLにするための基準
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    // 各ページでタイトルを指定すると「ページ名 | MedTrack」になる
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  // モバイルでコードなどの長い数字が電話番号としてリンクにならないようにする
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: "/ogp.png", width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/ogp.png"],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} antialiased`}
      >
        <Toaster richColors closeButton position="top-right"/>
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
      </body>
    </html>
  );
}
