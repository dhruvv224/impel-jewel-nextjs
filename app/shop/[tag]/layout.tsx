import type { Metadata } from "next";
import { getShopMetadata } from "../seo-metadata";

// This layout handles metadata for dynamic tag pages
export async function generateMetadata({
  params,
}: {
  params: { tag: string };
}): Promise<Metadata> {
  const tag = params?.tag || null;
  // The tag comes as a slug (e.g., "fancy", "round", "butterfly")
  // Use it directly for lookup
  const tagSlug = tag ? tag.toLowerCase().trim() : null;
  return getShopMetadata(tagSlug);
}

export default function ShopTagLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

