import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";
import Script from 'next/script'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GWA Buddy",
  description: "A web application that helps NEUST students calculate their General Weighted Average (GWA) based on their grades.",
  authors: [
    {
      name: 'alecz.r',
      url: 'https://aleczr.link',
    }
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gwa.vps.aleczr.link'),
  openGraph: {
    images: '/og-image.png',
  },
  other: {
    "darkreader-lock": "true",
    "theme-color": "#00c951",
    "apple-mobile-web-app-title": "GWA Buddy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {
        process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL &&
        process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="lazyOnload"
          />
        )
      }
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <div className="fixed bottom-4 right-4 z-[900]">
            <ThemeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
