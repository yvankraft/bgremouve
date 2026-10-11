import { ImageResponse } from "next/og";

export const alt = "Remoove — Détourage photo gratuit par IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0b1e42 0%, #020617 55%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                fontSize: 52,
                fontWeight: 800,
                color: "white",
              }}
            >
              R
            </div>
            <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1 }}>
              Remoove
            </div>
          </div>
          <div style={{ fontSize: 26, color: "#64748b" }}>
            remoove.yvancorps.com
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Supprimez le fond de vos photos en un clic
          </div>
          <div style={{ fontSize: 30, color: "#94a3b8", maxWidth: 860 }}>
            Gratuit, illimité, sans filigrane — traitement 100% local, vos
            images ne quittent jamais votre appareil.
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {["Traitement par lot", "Export PNG & ZIP", "Cameroun · Afrique centrale"].map(
            (chip) => (
              <div
                key={chip}
                style={{
                  fontSize: 24,
                  color: "#7dd3fc",
                  background: "rgba(14,165,233,0.12)",
                  border: "1px solid rgba(14,165,233,0.35)",
                  borderRadius: 999,
                  padding: "10px 22px",
                }}
              >
                {chip}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
