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
  title: "Il Tuo Locale | Sito Web Personalizzato",
  description:
    "Il sito è ora completamente personalizzabile tramite il file di configurazione centrale.",
  keywords: [
    "Ristorante",
    "Locale",
    "Menu",
    "Contatti",
    "Sito Web",
    "Personalizzato",
  ],
  openGraph: {
    title: "Il Tuo Locale",
    description: "Sito web personalizzato e modulare per il tuo ristorante.",
    url: "https://www.example.com",
    siteName: "Il Tuo Locale",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Locale personalizzato",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Il Tuo Locale",
    description: "Sito web personalizzato e modulare per il tuo ristorante.",
  },
  alternates: {
    canonical: "https://www.example.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Il Tuo Locale",
  image:
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop",
  servesCuisine: ["Italian", "Street Food"],
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Via del Tuo Locale",
    addressLocality: "La tua città",
    postalCode: "00000",
    addressRegion: "IT",
    addressCountry: "IT",
  },
  telephone: "+39 000 000 0000",
  email: "info@iltuolocale.it",
  sameAs: ["https://instagram.com"],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday"], opens: "08:00", closes: "01:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday","Saturday"], opens: "08:00", closes: "02:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "17:00", closes: "23:30" },
  ],
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
