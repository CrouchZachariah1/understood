import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import { getActiveTheme, tokensToCss } from "@/lib/theme/engine";
import "./globals.css";

export const dynamic = "force-dynamic";

const outfit = Outfit({
  subsets: ["latin"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: {
    default: "UNDERSTOOD. — Comfort. Understood.",
    template: "%s · UNDERSTOOD.",
  },
  description:
    "A South African retail brand for growing families. Colourful everyday pieces, starting with NIKU briefs for toddlers, kids and youth.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const theme = await getActiveTheme();
  const css = tokensToCss(theme);
  return (
    <html
      lang="en-ZA"
      className={`${syne.variable} h-full antialiased`}
      data-season={theme.season.toLowerCase()}
      style={css as CSSProperties}
    >
      <body className={`${outfit.className} min-h-full flex flex-col texture-${theme.decorative === "bloom" ? "spring" : theme.decorative === "leaf" ? "autumn" : theme.decorative === "rain" ? "winter" : "summer"}`}>
        {children}
      </body>
    </html>
  );
}
