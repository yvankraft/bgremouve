import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Remoove — Détourage photo par IA",
    short_name: "Remoove",
    description:
      "Supprimez le fond de vos photos en un clic, seules ou par lot. Gratuit, illimité, 100% local : vos images ne quittent jamais votre appareil.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    lang: "fr",
    categories: ["photo", "graphics", "utilities"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
