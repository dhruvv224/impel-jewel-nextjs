import type { Metadata } from "next";
import { getShopMetadata } from "./seo-metadata";

// This layout handles metadata for the main /shop page
// Metadata for /shop/[tag] pages is handled in app/shop/[tag]/layout.tsx
export async function generateMetadata(): Promise<Metadata> {
  return getShopMetadata(null);
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

