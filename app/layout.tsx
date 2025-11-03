// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./AppProviders";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Impel Store",
  description: "Find handcrafted heart pendants & earrings at Impel. Perfect for gifts, Valentine's & daily wear. Shop affordable heart jewelry online in India today.",
  icons: {
    icon: [
      { url: "/IMPEL-FAV.png", type: "image/png", sizes: "32x32" },
      { url: "/IMPEL-FAV.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/IMPEL-FAV.png",
    apple: "/IMPEL-FAV.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
