import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import profileService from "../services/Home";

const CustomPage = () => {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["CustomPages", id],
    queryFn: () => profileService.CustomPages({ page_slug: id }),
    keepPreviousData: true,
    onError: (err) => console.log("Error fetching page details:", err),
  });

  if (isLoading && !data?.length)
    return (
      <div className="loaderContainer">
        <div className="loader"></div>
      </div>
    );

  const { name, image, content } = data?.data || {};

  return (
    <>
      <Helmet>
        <title>Impel Store - {name || ""}</title>

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
        <meta property="og:image" content={image || "/default-image.jpg"} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={name || "Impel Store"} />
        <meta
          name="twitter:description"
          content={name || "Default description for SEO"}
        />
        <meta name="twitter:image" content={image || "/default-image.jpg"} />
      </Helmet>

      <section className="custom-pages">
        <div className="container">
          <h1 className="text-center">{name}</h1>
          <div className="row mt-5">
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
