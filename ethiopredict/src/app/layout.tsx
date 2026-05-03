import type { Metadata } from "next";
import { Outfit, Bebas_Neue } from "next/font/google";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "EthioPredict | የእግር ኳስ ትንበያ",
  description:
    "Ethiopia's #1 football prediction platform. Free daily tips for EPL, Champions League & Ethiopian Premier League in Amharic & English.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${bebasNeue.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0] flex flex-col">
        <LanguageProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
