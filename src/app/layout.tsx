import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

// UI text — crisp, neutral, excellent Vietnamese support
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

// Headings — modern geometric, slightly expressive but still clean
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "NovelVerse — Đọc Truyện Chữ Online",
  description:
    "Nền tảng đọc truyện chữ cao cấp. Trải nghiệm sang trọng, tối giản và tập trung vào nội dung.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${manrope.variable}`}>
      <body suppressHydrationWarning className="antialiased min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
