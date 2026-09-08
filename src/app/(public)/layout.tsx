"use client"

import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}