import type { Metadata } from "next";
import { Figtree, Fira_Code } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Script from "next/script";
import { Suspense } from "react";

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-mono' });

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
    "theme-color": "#15ba81",
    "apple-mobile-web-app-title": "GWA Buddy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} ${firaCode.variable}`} suppressHydrationWarning>
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
      <body
        className='antialiased'
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <Suspense>
              {children}
            </Suspense>
            <Toaster
              position="bottom-left"
              closeButton
              richColors
            />
            <div
              className="fixed top-4 right-4"
            >
              <ThemeSwitcher />
            </div>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
