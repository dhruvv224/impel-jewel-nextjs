'use client'; // ⬅️ REQUIRED: This tells Next.js to render this component on the client, enabling hooks like useQuery.

import React from "react";
import Link from "next/link"; // ✅ Replaces 'react-router-dom' Link
import Head from "next/head"; // ✅ Replaces 'react-helmet-async' Helmet
import categoriesService from "../services/Home"; // NOTE: Corrected path from '../services/Home' to '../../services/Home' based on standard structure
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const Categories = () => {

  const { data: allCategories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.category(),
    select: (data) => data?.data,
  });

  const shimmerItems = Array(10).fill(null);

  return (
    <>
      <Head> {/* ✅ Next.js equivalent for setting document metadata */}
        <title>Impel Store - All Categories</title>
      </Head>
      <section className="categories">
        <div className="container">
          <div className="categories_header">
            <h3>Categories</h3>
          </div>
          <div className="row g-4">
            {isLoading ? (
              <>
                {shimmerItems.map((_, index) => (
                  <div className="col-lg-3 col-md-6 col-12" key={index}>
                    <div className="shimmer-product">
                      <div className="shimmer-image"></div>
                      <div className="shimmer-price"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {allCategories?.map((data: any, index: number) => {
                    // 1. Logic to create the URL slug (from original code)
                  const slug = encodeURIComponent(data.name.toLowerCase().replace(/\s+/g, '-'));
                    
                    // 2. Combine SLUG (in path) and ID (in query) for Next.js href
                    // This replaces the state object: state={{ id: data.id, name: data.name }}
                    const href = `/categories/${slug}?id=${data.id}`;

                  return (
                    <div className="col-lg-3 col-md-6 col-12" key={index}>
                      <div className="category-list-box h-100">
                        <Link
                          href={href} // ✅ Converted 'to' prop to 'href' with slug and id in URL
                          className="text-decoration-none"
                          style={{ color: "#000" }}
                        >
                          <div className="category_data_item">
                            <motion.img
                              src={data?.image}
                              alt={data?.name}
                              className="w-100"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              whileHover={{ scale: 1.05 }}
                            />
                            <div className="product_details">
                              <h4 className="fw-bolder">{data?.name}</h4>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Categories;