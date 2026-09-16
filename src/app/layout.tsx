import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app"

 
const notoSansJP = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap'
});

/** GA4の測定ID */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID


export const metadata: Metadata = {
  title: "MedTrack",
  description: "出荷情報を管理できる医薬品データベースアプリです",
  // モバイルでコードなどの長い数字が電話番号としてリンクにならないようにする
  formatDetection: { telephone: false },
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

        {/* GA4の設置 */}
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
