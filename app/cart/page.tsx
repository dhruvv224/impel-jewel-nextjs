import React from "react";
import Head from "next/head"; // Replaced Helmet
import { useRouter } from "next/router"; // Replaced useParams
import { useQuery } from "@tanstack/react-query";
import profileService from "../services/Home";

// Define your base URL for Open Graph tags.
// In a real application, this should be an environment variable.
const BASE_URL = "https://www.yourdomain.com"; 

const CustomPage = () => {
  const router = useRouter();
  // Get the dynamic segment (slug) from the URL query.
  const { id } = router.query; 

  // Only run the query if the router has populated the `id`
  const { data, isLoading } = useQuery({
    queryKey: ["CustomPages", id],
    queryFn: () => profileService.CustomPages({ page_slug: id }),
    keepPreviousData: true,
    enabled: !!id, // Only run the query when 'id' is available
    onError: (err) => console.log("Error fetching page details:", err),
  });

  const { name, image, content } = data?.data || {};

  // Construct the canonical URL and Open Graph URL
  const canonicalUrl = `${BASE_URL}${router.asPath}`;

  // Use optional chaining with fallback for image URL
  const ogImage = image || `${BASE_URL}/default-image.jpg`;

  if (isLoading || !id)
    return (
      <div className="loaderContainer">
        <div className="loader"></div>
      </div>
    );

  // You might want to display a 404 page if data is not found (e.g., if `data` is null/empty)
  // if (!data?.data) {
  //   router.push('/404'); // Redirect to 404 page
  //   return null;
  // }
  
  return (
    <>
      {/* Replaced Helmet with Next.js Head component for SEO and metadata */}
      <Head>
        <title>Impel Store - {name || "Loading..."}</title>
        <link rel="canonical" href={canonicalUrl} />

        {/* Dynamically set meta tags */}
        <meta
          name="description"
          content={name || "Default description for SEO"}
        />
        <meta
          name="keywords"
          content={name || "store, products, impel, custom pages"}
        />

        {/* Open Graph tags for social media sharing */}
        <meta property="og:title" content={name || "Impel Store"} />
        <meta
          property="og:description"
          content={name || "Default description for SEO"}
        />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={name || "Impel Store"} />
        <meta
          name="twitter:description"
          content={name || "Default description for SEO"}
        />
        <meta name="twitter:image" content={ogImage} />
      </Head>

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

export default CustomPage;