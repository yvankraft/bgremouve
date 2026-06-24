import type { Metadata } from "next";
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
  title: "Remoove | Supprimer fond image gratuitement en ligne (IA)",
  description:
    "Détourez vos photos produits instantanément avec notre IA. Outil 100% gratuit, rapide et performant. Supprimez l'arrière-plan en un clic.",
  keywords:
    "supprimer fond image, 100% gratuit, retirer arrière plan, détourage photo automatique, outil détourage gratuit, traitement image en ligne, background remover, remove background online, AI image processing, free photo editing tool, Détourage photo Cameroun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased `}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
