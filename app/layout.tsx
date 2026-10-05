import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";

import { PROJECT } from "@/lib/config/project";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${PROJECT.name} — ${PROJECT.tagline}`,
    template: `%s · ${PROJECT.name}`,
  },
  description: PROJECT.description,
  applicationName: PROJECT.name,
};

export const viewport: Viewport = {
  themeColor: "#0b0f1d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
