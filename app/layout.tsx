import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "パーリ語学習サイト",
  description: "パーリ語の経典を学習するためのサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}

