import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Use Inter for body text while display headings use the Bebas Neue import from globals.css
const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.example.com"),
  title: "NOVA COMENSIS | Calcio a 7 Como",
  description:
    "Nova Comensis: squadra di calcio a 7 a Como, prossime partite, notizie e contenuti professionali.",
  keywords: [
    "Nova Comensis",
    "Calcio a 7",
    "Como",
    "Serie C",
    "Partite",
    "Contatti",
    "Social",
  ],
  openGraph: {
    title: "NOVA COMENSIS",
    description: "Squadra di calcio a 7 a Como: partite, notizie e contenuti social professionali.",
    url: "https://www.example.com",
    siteName: "NOVA COMENSIS",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "NOVA COMENSIS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NOVA COMENSIS",
    description: "Squadra di calcio a 7 a Como: partite, notizie e contenuti social professionali.",
  },
  alternates: {
    canonical: "https://www.example.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsTeam",
  name: "NOVA COMENSIS",
  sport: "Football",
  areaServed: "Como",
  url: "https://www.example.com",
  sameAs: ["https://www.instagram.com/nova.comensis/"],
  email: "novacomensis@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Via Adamello 18",
    addressLocality: "Como",
    postalCode: "22100",
    addressRegion: "CO",
    addressCountry: "IT",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${bodyFont.variable} font-body bg-[#0A0A0A]`}>
        {children}
      </body>
    </html>
  );
}
