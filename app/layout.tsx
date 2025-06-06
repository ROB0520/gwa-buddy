import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";
import Head from "next/head";

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
    }
  ],
  metadataBase: new URL('https://gwa.vps.aleczr.link'),
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
      <Head>
        <script defer src="https://umami.vps.aleczr.link/script.js" data-website-id="f9cd8bfd-2b2c-498b-9214-d5aa9056d57f"></script>
      </Head>
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
