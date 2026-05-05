import type { Metadata } from "next";
import { Outfit, Bebas_Neue } from "next/font/google";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
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
  metadataBase: new URL('https://ethiopredict.vercel.app'),
  title: { default: "EthioPredict — Ethiopia's #1 Football Predictions", template: '%s | EthioPredict' },
  description: "Free daily football predictions for EPL, Champions League, Ethiopian Premier League and more. Expert tips in Amharic and English.",
  keywords: ['football predictions', 'Ethiopia betting tips', 'EPL predictions', 'Champions League tips', 'Ethiopian Premier League'],
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ethiopredict.vercel.app',
    siteName: 'EthioPredict',
    title: "EthioPredict — Ethiopia's #1 Football Predictions",
    description: "Free daily football predictions for EPL, Champions League & Ethiopian Premier League.",
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'EthioPredict' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "EthioPredict — Ethiopia's #1 Football Predictions",
    description: "Free daily football predictions in Amharic & English.",
  },
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
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ''} />
        <LanguageProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
