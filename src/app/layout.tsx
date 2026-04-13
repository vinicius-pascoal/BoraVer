import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BoraVer - Descubra o que assistir",
  description:
    "Descubra rapidamente um filme ou série para assistir com base em seus filtros preferidos.",
  keywords: ["filme", "série", "sorteio", "streaming", "diversão"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#8b5cf6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="text-white">{children}</body>
    </html>
  );
}
