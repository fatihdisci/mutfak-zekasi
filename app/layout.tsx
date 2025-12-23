import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mutfak Zekası",
  description: "Yapay Zeka Destekli Beslenme Asistanı",
  manifest: "/manifest.json",
  // 👇 İKON AYARI BURADA (iPhone ve Android için)
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      {/* selection:bg-emerald-100 ile seçilen metinler yeşil parlar */}
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased overflow-x-hidden selection:bg-emerald-100`}>
        {children}
      </body>
    </html>
  );
}