import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
 
const notoSansJP = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap'
});


export const metadata: Metadata = {
  title: "MedTrack",
  description: "出荷情報を管理できる医薬品データベースアプリです",
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
        <Toaster richColors position="top-center"/>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}

