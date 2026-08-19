import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Collins Motors — Vehículos Usados en Temuco",
  description: "Encuentra tu próximo vehículo en Collins Motors. Amplio inventario de autos usados con financiamiento disponible.",
  metadataBase: new URL("https://collinsmotors.cl"),
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        {/* Overlay de ruido global */}
        <svg className="noise-overlay" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" opacity="0.05" />
        </svg>

        {children}
      </body>
    </html>
  );
}
