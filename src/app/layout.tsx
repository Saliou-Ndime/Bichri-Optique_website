import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Bichri Optique - Votre Opticien en Ligne",
    template: "%s | Bichri Optique",
  },
  description:
    "Découvrez notre collection de lunettes de vue, lunettes de soleil, montures et lentilles. Livraison partout au Sénégal.",
  keywords: [
    "lunettes",
    "optique",
    "montures",
    "lunettes de soleil",
    "lunettes de vue",
    "opticien",
    "Sénégal",
    "Dakar",
  ],
  openGraph: {
    title: "Bichri Optique",
    description: "Votre opticien en ligne de confiance",
    type: "website",
    locale: "fr_SN",
    siteName: "Bichri Optique",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
