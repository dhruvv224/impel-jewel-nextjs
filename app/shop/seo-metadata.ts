import { Metadata } from "next";

const BASE_URL = "https://impel.store";

// SEO metadata mapping for different shop pages
export const shopSeoMetadata: Record<string, Metadata> = {
  // Main shop page
  home: {
    title: "Impel Gold & Silver Jewelry India – Handcrafted Gold Earrings, Pendants & Rings",
    description: "Shop Impel's handcrafted gold and Silver jewelry online in India. Explore elegant earrings, pendants, solitaire & floral designs in gold with fast delivery and affordable prices.",
    openGraph: {
      title: "Impel Gold & Silver Jewelry India – Handcrafted Gold Earrings, Pendants & Rings",
      description: "Shop Impel's handcrafted gold and Silver jewelry online in India. Explore elegant earrings, pendants, solitaire & floral designs in gold with fast delivery and affordable prices.",
      url: `${BASE_URL}/shop`,
      siteName: "Impel",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Impel Gold & Silver Jewelry India – Handcrafted Gold Earrings, Pendants & Rings",
      description: "Shop Impel's handcrafted gold and Silver jewelry online in India. Explore elegant earrings, pendants, solitaire & floral designs in gold with fast delivery and affordable prices.",
    },
    alternates: {
      canonical: `${BASE_URL}/shop`,
    },
  },
  // Fancy jewelry page
  fancy: {
    title: "Fancy Jewelry Online India – Earrings & Necklaces | Impel",
    description: "Explore Impel's fancy jewelry collection—party earrings, wedding necklaces & statement pieces. Affordable handcrafted fancy jewelry in India.",
    openGraph: {
      title: "Fancy Jewelry Online India – Earrings & Necklaces | Impel",
      description: "Explore Impel's fancy jewelry collection—party earrings, wedding necklaces & statement pieces. Affordable handcrafted fancy jewelry in India.",
      url: `${BASE_URL}/shop/fancy`,
      siteName: "Impel",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Fancy Jewelry Online India – Earrings & Necklaces | Impel",
      description: "Explore Impel's fancy jewelry collection—party earrings, wedding necklaces & statement pieces. Affordable handcrafted fancy jewelry in India.",
    },
    alternates: {
      canonical: `${BASE_URL}/shop/fancy`,
    },
  },
  // Round jewelry page
  round: {
    title: "Round Jewelry India – Pendants, Earrings & Hoops | Impel",
    description: "Discover Impel's round jewelry collection with handcrafted round pendants, hoop earrings & gemstone rings. Shop stylish round jewelry online in India.",
    openGraph: {
      title: "Round Jewelry India – Pendants, Earrings & Hoops | Impel",
      description: "Discover Impel's round jewelry collection with handcrafted round pendants, hoop earrings & gemstone rings. Shop stylish round jewelry online in India.",
      url: `${BASE_URL}/shop/round`,
      siteName: "Impel",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Round Jewelry India – Pendants, Earrings & Hoops | Impel",
      description: "Discover Impel's round jewelry collection with handcrafted round pendants, hoop earrings & gemstone rings. Shop stylish round jewelry online in India.",
    },
    alternates: {
      canonical: `${BASE_URL}/shop/round`,
    },
  },
  // Butterfly jewelry page
  butterfly: {
    title: "Butterfly Jewelry Online in India – Pendants & Earrings | Impel",
    description: "Impel brings delicate butterfly jewelry designs—pendants, earrings & charm bracelets in silver & oxidised finish. Buy handcrafted butterfly jewelry India.",
    openGraph: {
      title: "Butterfly Jewelry Online in India – Pendants & Earrings | Impel",
      description: "Impel brings delicate butterfly jewelry designs—pendants, earrings & charm bracelets in silver & oxidised finish. Buy handcrafted butterfly jewelry India.",
      url: `${BASE_URL}/shop/butterfly`,
      siteName: "Impel",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Butterfly Jewelry Online in India – Pendants & Earrings | Impel",
      description: "Impel brings delicate butterfly jewelry designs—pendants, earrings & charm bracelets in silver & oxidised finish. Buy handcrafted butterfly jewelry India.",
    },
    alternates: {
      canonical: `${BASE_URL}/shop/butterfly`,
    },
  },
  // Flower jewelry page
  flower: {
    title: "Flower Jewelry India – Floral Earrings & Pendants | Impel",
    description: "Shop Impel's flower jewelry collection—floral pendants, earrings & handcrafted accessories. Perfect for weddings, Haldi & Mehendi. Buy online in India.",
    openGraph: {
      title: "Flower Jewelry India – Floral Earrings & Pendants | Impel",
      description: "Shop Impel's flower jewelry collection—floral pendants, earrings & handcrafted accessories. Perfect for weddings, Haldi & Mehendi. Buy online in India.",
      url: `${BASE_URL}/shop/flower`,
      siteName: "Impel",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Flower Jewelry India – Floral Earrings & Pendants | Impel",
      description: "Shop Impel's flower jewelry collection—floral pendants, earrings & handcrafted accessories. Perfect for weddings, Haldi & Mehendi. Buy online in India.",
    },
    alternates: {
      canonical: `${BASE_URL}/shop/flower`,
    },
  },
  // Solitaire jewelry page
  solitaire: {
    title: "Solitaire Jewelry India – Pendants, Earrings & Rings | Impel",
    description: "Impel's solitaire collection features elegant pendants, rings & stud earrings in silver & lab-grown designs. Buy solitaire jewelry online in India today.",
    openGraph: {
      title: "Solitaire Jewelry India – Pendants, Earrings & Rings | Impel",
      description: "Impel's solitaire collection features elegant pendants, rings & stud earrings in silver & lab-grown designs. Buy solitaire jewelry online in India today.",
      url: `${BASE_URL}/shop/solitaire`,
      siteName: "Impel",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Solitaire Jewelry India – Pendants, Earrings & Rings | Impel",
      description: "Impel's solitaire collection features elegant pendants, rings & stud earrings in silver & lab-grown designs. Buy solitaire jewelry online in India today.",
    },
    alternates: {
      canonical: `${BASE_URL}/shop/solitaire`,
    },
  },
  // Heart jewelry page
  heart: {
    title: "Heart Jewelry India – Pendants & Earrings Online | Impel",
    description: "Find handcrafted heart pendants & earrings at Impel. Perfect for gifts, Valentine's & daily wear. Shop affordable heart jewelry online in India today.",
    openGraph: {
      title: "Heart Jewelry India – Pendants & Earrings Online | Impel",
      description: "Find handcrafted heart pendants & earrings at Impel. Perfect for gifts, Valentine's & daily wear. Shop affordable heart jewelry online in India today.",
      url: `${BASE_URL}/shop/heart`,
      siteName: "Impel",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Heart Jewelry India – Pendants & Earrings Online | Impel",
      description: "Find handcrafted heart pendants & earrings at Impel. Perfect for gifts, Valentine's & daily wear. Shop affordable heart jewelry online in India today.",
    },
    alternates: {
      canonical: `${BASE_URL}/shop/heart`,
    },
  },
};

// Helper function to get metadata by tag slug
export function getShopMetadata(tag: string | null): Metadata {
  if (!tag) {
    return shopSeoMetadata.home;
  }
  
  const normalizedTag = tag.toLowerCase().trim();
  return shopSeoMetadata[normalizedTag] || shopSeoMetadata.home;
}

