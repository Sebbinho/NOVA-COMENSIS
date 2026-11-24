import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { readCalendar } from "./lib/calendar-store";
import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const calendar = await readCalendar();
  return {
    title: calendar.siteCopy.brand,
    description: calendar.siteCopy.pwaDescription,
    applicationName: calendar.siteCopy.brand,
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: calendar.siteCopy.adventTab,
    },
    icons: {
      icon: "/icon.svg",
      apple: "/icon.svg",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${bodyFont.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
