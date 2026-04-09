import type { Metadata } from "next";
import { Cormorant_Garamond, Syne, DM_Mono } from "next/font/google";
import "./globals.css";
import { AlertProvider } from "@/components/ui/AlertProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import CookieConsent from "@/components/ui/CookieConsent";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const syne = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-syne",
});

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Clover Hills",
  description: "Clover Hills — Institutional-grade algorithmic trading infrastructure for digital asset portfolios.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${cormorant.variable} ${dmMono.variable}`}>
      <body className="bg-background text-foreground antialiased min-h-screen overflow-x-hidden selection:bg-[var(--gold)] selection:text-foreground">
        <AlertProvider>
          <CustomCursor />
          <CookieConsent />
          {children}
        </AlertProvider>
      </body>
    </html>
  );
}
