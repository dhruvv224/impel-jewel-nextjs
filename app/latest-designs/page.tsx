"use client"; // 👈 Mark as a Client Component

import React from "react";
// Import Next.js Link and Image components
import Link from "next/link";
import Image from "next/image";
// Removed: import { Helmet } from "react-helmet-async";
// Removed: import { Link } from "react-router-dom";
import homeService from "../services/Home";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { motion } from "framer-motion";
// Assuming this path is correct for a local image file
import { useQuery } from "@tanstack/react-query";

// Define an explicit constant for the noImage src for use in next/image
const NO_IMAGE_SRC = '/assets/images/No_Image_Available.jpg '

const LatestDesign = () => {
  // Data fetching remains the same since @tanstack/react-query works cross-framework
  const { data: designs, isLoading } = useQuery({
    queryKey: ["RecentAdd"],
    queryFn: () => homeService.RecentAdd(),
    select: (data) => data?.data || [],
  });

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN")?.format(Math?.round(value));

  const shimmerItems = Array(20).fill(null);

  // Helper function to construct the Next.js Link href and detail URL slug
  const getProductHref = (data) => {
    // Construct a SEO-friendly slug
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Clean URL with only slug and code (no query params)
    return `/shopdetails/${slug}/${data.code}`;
  };

  return (
    <>
      {/* Next.js client-side equivalent of <Helmet> */}
      <title>Impel Store - Latest designs</title>
      <section className="categories">
        <div className="container">
          <div className="categories_header">
            <h3>Latest Designs</h3>
          </div>
          <div className="categories_data">
            {isLoading ? (
              <>
                <div className="row">
                  {/* Shimmer loading section remains the same */}
                  {shimmerItems.map((_, index) => (
                    <div key={`shimmer-${index}`} className="col-lg-3 col-md-6 col-12">
                      <div className="shimmer-product">
                        <div className="shimmer-image"></div>
                        <div className="shimmer-price"></div>
                        <div className="shimmer-price"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="row">
                  {designs?.length > 0 ? (
                    <>
                      {/* Limit data rendering here to match previous behavior */}
                      {designs?.slice(0, 200)?.map((data) => {
                        // Use a unique key for list items
                        const imageSource = data?.image || '/assets/images/No_Image_Available.jpg';
                        const altText = data?.name || "Product Image";
                        
                        return (
                          <div key={data.id || data.code} className="col-md-3 col-sm-4 col-xs-6">
                            <motion.div
                              className="item-product text-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              {/* Use Next.js Link component with dynamic href structure */}
                              <Link href={getProductHref(data)} passHref legacyBehavior>
                                <motion.a 
                                  className="product-link-wrapper"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.5 }}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <div className="product-thumb">
                                    {/* Use Next.js Image component */}
                                    <Image
                                      src={imageSource}
                                      alt={altText}
                                      className="w-100"
                                      // Note: width and height are required for next/image. 
                                      // Adjust these based on your image aspect ratio and design.
                                      width={300} 
                                      height={300}
                                      style={{ objectFit: 'cover' }}
                                      // If image URL is external and domain isn't configured, this will fail.
                                      // Ensure the image domain is added to next.config.js.
                                      unoptimized={!data?.image} // Don't optimize the fallback image
                                    />
                                  </div>
                                  <div className="product-info d-grid">
                                    {data?.making_charge_discount_18k > 0 ? (
                                      <>
                                        <del style={{ color: "#000" }}>
                                          ₹
                                          {numberFormat(
                                            data?.making_charge_18k +
                                              data?.metal_value_18k
                                          )}
                                        </del>
                                        <label>
                                          <strong className="text-success">
                                            ₹
                                            {numberFormat(
                                              data?.metal_value_18k +
                                                data?.making_charge_discount_18k
                                            )}
                                          </strong>
                                        </label>
                                      </>
                                    ) : (
                                      <strong className="text-success">
                                        ₹{numberFormat(data?.total_amount_18k)}
                                      </strong>
                                    )}
                                  </div>
                                </motion.a>
                              </Link>
                            </motion.div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <div
                        className="categoriesData-not text-center"
                        style={{
                          fontSize: "35px",
                          fontWeight: "600",
                          marginTop: "150px",
                        }}
                      >
                        <p>
                          Unfortunately, latest-designs is not available at the
                          moment.
                        </p>
                      </div>
                      <div className="text-center mt-md-3">
                        {/* Use Next.js Link component */}
                        <Link
                          href="/"
                          className="view_all_btn px-4 py-2"
                          style={{ borderRadius: "8px" }}
                          passHref
                        >
                            <FaLongArrowAltLeft className="mr-2" /> &nbsp;Back to
                            Home
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default LatestDesign;