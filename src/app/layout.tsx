import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import GrainOverlay from "@/components/GrainOverlay";
import LiquidProgress from "@/components/ui/LiquidProgress";
import Preloader from "@/components/Preloader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PERFECTION BY BACHIR — Luxury Car Renovation | Dakar",
  description:
    "Atelier de rénovation automobile haut de gamme à Dakar, Sénégal. Detailing, ceramic coating, restauration cuir, polish carrosserie.",
  keywords: [
    "rénovation automobile Dakar",
    "detailing Dakar",
    "ceramic coating Sénégal",
    "lavage premium Dakar",
    "perfection bachir",
  ],
  authors: [{ name: "Perfection by Bachir" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "PERFECTION BY BACHIR",
    description: "Luxury Car Renovation — Dakar, Sénégal",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${syne.variable} font-sans antialiased bg-bachir-black text-bachir-white cursor-none`}
      >
        <Preloader />
        <SmoothScroll />
        <CustomCursor />
        <GrainOverlay />
        <LiquidProgress />
        {children}
      </body>
    </html>
  );
}
