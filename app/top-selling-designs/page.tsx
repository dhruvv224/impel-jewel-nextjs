'use client'; // 👈 Mark as a Client Component

import React, { useEffect, useState } from "react";
import homeService from "../services/Home"; // Assuming path is correct
// Import Next.js Link component
import Link from "next/link"; 
// Removed: import { Helmet } from "react-helmet-async";
// Removed: import { Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import Loader from "../components/common/Loader"; // Assuming path is correct

const Topseller = () => {
  const [TopSell, SetTopSell] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const HighSell = () => {
    homeService
      .TopSelling()
      .then((res) => {
        SetTopSell(res.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching top sellers:", err);
        SetTopSell([]);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    HighSell();
  }, []);

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN")?.format(Math?.round(value));
    
  // Placeholder for a remote default image
  const NO_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";


  return (
    <>
      {/* Client-side equivalent for setting the page title */}
      <title>Impel Store - Top selling designs</title>
      
      <section className="categories">
        <div className="container">
          <div className="categories_header">
            <h3>Top Selling Designs</h3>
          </div>
          <div className="categories_data">
            <div className="row">
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  {TopSell?.length > 0 ? (
                    <>
                      {TopSell.map((data, index) => {
                        // Use a stable, unique key
                        const productLink = `/shopdetails/${data?.id}`;
                        const imageUrl = data?.image || NO_IMAGE_URL;

                        return (
                          <div key={data.id || index} className="col-md-3 col-sm-4 col-xs-6">
                            <div className="item-product text-center">
                              {/* Use Next.js Link component */}
                              <Link href={productLink}>
                                <div className="product-thumb">
                                  {/* Using standard img tag for external/dynamic URLs */}
                                  <img
                                    src={imageUrl}
                                    alt={data?.name || "Product image"}
                                    className="w-100"
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
                              </Link>
                            </div>
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
                          Unfortunately, top-selling-designs is not available at
                          the moment.
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
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Topseller;