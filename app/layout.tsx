// app/layout.tsx  <-- This file must contain this content:

import type { Metadata } from "next";
import "./globals.css";
// NOTE: Make sure the import path is correct (./AppProviders)
import Providers from "./AppProviders"; 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 🛑 The <body> tag MUST be here in the Server Component 🛑 */}
      <body className={` antialiased`}>
        {/* Providers (the client component wrapper) goes inside the body. */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}