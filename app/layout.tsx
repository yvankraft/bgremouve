import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://remoove.yvancorps.com"),
  title: {
    default:
      "Remoove — Supprimer le fond d’une photo gratuitement | Cameroun & Afrique centrale",
    template: "%s | Remoove",
  },
  description:
    "Détourez vos photos en un clic, seules ou par lot, directement dans votre navigateur. Outil gratuit et illimité pensé pour le Cameroun et l’Afrique centrale : photos produits, photos d’identité, réseaux sociaux. 100% local, sans filigrane.",
  keywords: [
    "supprimer fond photo",
    "détourage photo gratuit",
    "enlever arrière-plan image",
    "retirer le fond d'une photo",
    "background remover free",
    "photo d'identité en ligne",
    "détourage photo produit",
    "photos produits Jumia",
    "détourage photo Cameroun",
    "Douala",
    "Yaoundé",
    "Gabon",
    "Congo",
    "RDC",
    "Tchad",
    "Centrafrique",
    "Afrique centrale",
    "CEMAC",
    "remove background Cameroon",
    "AI image processing",
    "free photo editing tool",
  ],
  applicationName: "Remoove",
  authors: [{ name: "Wildis", url: "https://yvancorps.com" }],
  creator: "Wildis",
  publisher: "Wildis",
  alternates: { canonical: "/" },
  category: "multimedia",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://remoove.yvancorps.com",
    siteName: "Remoove",
    title: "Remoove — Détourage photo gratuit par IA",
    description:
      "Supprimez le fond de vos images en un clic, seules ou par lot, 100% dans votre navigateur. Gratuit, illimité, sans filigrane.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remoove — Détourage photo gratuit par IA",
    description:
      "Supprimez le fond de vos images en un clic, seules ou par lot. Gratuit, illimité, sans filigrane.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [{ url: "/icon.svg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
