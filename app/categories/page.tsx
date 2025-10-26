import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import categoriesService from "../../services/Home";
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
      <Helmet>
        <title>Impel Store - All Categories</title>
      </Helmet>
      <section className="categories">
        <div className="container">
          <div className="categories_header">
            <h3>Categories</h3>
          </div>
          <div className="row">
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
                {allCategories?.map((data, index) => {
                  return (
                    <div className="col-lg-3 col-md-6 col-12 mb-4" key={index}>
                      <div className="category-list-box">
                        <Link
                          to={`/categories/${encodeURIComponent(data.name.toLowerCase().replace(/\s+/g, '-'))}`}
                          state={{ id: data.id, name: data.name }}
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
