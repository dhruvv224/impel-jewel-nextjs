'use client'; // ⬅️ REQUIRED: We need a Client Component for 'useQuery' and client-side routing hooks.

import React from "react";
// ✅ App Router Replacements:
import { useSearchParams, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import profileService from "../services/Home";

// NOTE: In the App Router, global metadata is best handled by exporting a 'metadata'
// object from the corresponding 'layout.js' or 'page.js' file. 
// However, since this component fetches dynamic data, we'll keep the dynamic meta inside.
// We must replace 'next/head' with a dynamic method or a simple <title> wrapper on the client.
// To fully support all the dynamic meta tags (Open Graph, etc.) from the server, 
// you would usually use the 'generateMetadata' function in the parent Server Component.
// Since we are keeping this entirely client-side for compatibility with your existing structure,
// we will use a simple client-side method or assume the root layout handles global tags.

// Define your base URL for Open Graph tags. 
const BASE_URL = "https://www.yourdomain.com"; 

const CustomPage = () => {
  // ❌ Removed: const router = useRouter(); 

  // ✅ App Router: Use useParams to get dynamic path segments (e.g., in app/[id]/page.js)
  const params = useParams();
  // Next.js useParams automatically decodes URL-encoded path segments
  // For slugs with special characters like &, ensure proper decoding
  // Handle both string and string[] cases
  const rawIdParam = params.id;
  const rawId = Array.isArray(rawIdParam) ? rawIdParam[0] || '' : rawIdParam || '';
  
  // Decode the slug to handle special characters like &
  // Next.js should decode automatically, but handle cases where it might not
  let id = rawId;
  try {
    // Always try to decode in case Next.js didn't decode it (shouldn't happen, but safe)
    id = decodeURIComponent(rawId);
  } catch (e) {
    // If decoding fails (already decoded or no encoding needed), use as-is
    id = rawId;
  }
  
  // Debug log to verify slug
  React.useEffect(() => {
    if (id) {
      console.log('CustomPage - Raw slug from params:', rawId);
      console.log('CustomPage - Decoded slug:', id);
    }
  }, [id, rawId]);
  
  // NOTE: If you were passing the slug as a query, you'd use:
  // const searchParams = useSearchParams();
  // const id = searchParams.get('slug'); 

  // Only run the query if the router has populated the `id`
  const { data, isLoading, error } = useQuery({
    queryKey: ["CustomPages", id],
    queryFn: () => {
      // Ensure the slug is sent correctly to the API without double-encoding
      const slug = id || '';
      console.log('Sending slug to API:', slug); // Debug log
      return profileService.CustomPages({ page_slug: slug });
    },
    placeholderData: (previousData) => previousData,
    enabled: !!id, // Only run the query when 'id' is available
  });
  
  // Log errors separately
  React.useEffect(() => {
    if (error) {
      console.log("Error fetching page details:", error);
    }
  }, [error]);

  const { name, image, content } = (data as any)?.data || {};

  // Construct the canonical URL and Open Graph URL
  // NOTE: This logic for canonicalUrl is complex in the Client Component.
  // We'll approximate it using window.location for client-side accuracy.
  const isBrowser = typeof window !== 'undefined';
  const currentPath = isBrowser ? window.location.pathname : ''; 
  const canonicalUrl = `${BASE_URL}${currentPath}`;
  
  // Use optional chaining with fallback for image URL
  const ogImage = image || `${BASE_URL}/default-image.jpg`;

  // Use simple loading state instead of router.isReady
  if (isLoading || !id)
    return (
      <div className="loaderContainer">
        <div className="loader"></div>
      </div>
    );

  return (
    <>
      {/* ✅ Next.js App Router Metadata Strategy (Client-side implementation):
        We cannot use next/head in the App Router. For client-fetched dynamic metadata,
        we must manually use the native React pattern to manipulate the document head.
        A dedicated 'MetadataComponent' would be a cleaner approach, but here we include it directly.
      */}
      {/* <DynamicMetadata 
        name={name} 
        canonicalUrl={canonicalUrl} 
        ogImage={ogImage}
      /> */}
      
      <section className="custom-pages">
        <div className="container">
          <h1 className="text-center">{name}</h1>
          <div className="row mt-5">
            {/* Check against the dynamic segment `id` from the router */}
            {id === "about-us" && image && (
              <img src={image} alt="About Us" className="w-100 mt-3 mb-3" />
            )}
            <div
              className="col-md-12"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomPage