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
  title: "Remoove — Détourage d'images par IA, 100% local et gratuit",
  description:
    "Supprimez l'arrière-plan de vos images en un clic, seules ou par lot. Traitement IA 100% local : vos images ne quittent jamais votre appareil. Gratuit, illimité, sans filigrane.",
  keywords:
    "supprimer fond image, 100% gratuit, retirer arrière plan, détourage photo automatique, outil détourage gratuit, traitement image en ligne, traitement par lot, background remover, remove background online, AI image processing, free photo editing tool, Détourage photo Cameroun",
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
