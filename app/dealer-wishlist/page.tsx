"use client";

import React, { useEffect, useState } from "react";
// Import next/link instead of react-router-dom/Link
import Link from "next/link";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
// Assuming these paths are correct relative to your project structure
import emptycart from "../../assets/images/empty-cart.png";
import DealerWishlist from "../services/Dealer/Collection";
import Loader from "../components/common/Loader";

// Since this is a client component, we can use the <title> tag directly
// as an alternative to next/head or the Metadata API in the App Router.

const DealerWishList = () => {
  const [DealerEmail, setDealerEmail] = useState(null);
  const [checkList, setCheckList] = useState(null); // Initialize to null for better loading handling
  const [isLoading, setIsLoading] = useState(true);
  const [removingItemId, setRemovingItemId] = useState(null);

  // Client-side access to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDealerEmail(localStorage.getItem("email"));
    }
  }, []);

  const collectionCheck = (email) => {
    if (!email) {
      setIsLoading(false);
      setCheckList([]);
      return;
    }
    
    setIsLoading(true);
    DealerWishlist.ListCollection({ email: email })
      .then((res) => {
        setCheckList(res.data?.wishlist_items || []);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setCheckList([]);
        console.error("Error fetching wishlist:", err);
      });
  };

  const removeFromWishList = (productId) => {
    if (!DealerEmail) {
        toast.error("User email not found. Please log in.");
        return;
    }

    setRemovingItemId(productId);
    DealerWishlist.removetodealerWishlist({
      email: DealerEmail,
      design_id: productId,
    })
      .then((res) => {
        if (res.success === true) {
          toast.success(res.message);
          // Re-run the fetch to update the list
          collectionCheck(DealerEmail);
        } else {
          toast.error(res.message || "Failed to remove item.");
        }
      })
      .catch((err) => {
        console.error("Error removing from wishlist:", err);
        toast.error("An error occurred while removing the item.");
      })
      .finally(() => {
        setRemovingItemId(null);
      });
  };

  useEffect(() => {
    // Only fetch data if the email is available (which means it's running client-side)
    if (DealerEmail) {
      collectionCheck(DealerEmail);
    }
    // Note: The dependency array includes DealerEmail to trigger the fetch
    // once the email is successfully retrieved from localStorage.
  }, [DealerEmail]);

  return (
    <>
      <title>Impel Store - Dealer Wishlist</title>
      <section className="wishlist">
        <div className="container">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {checkList?.length > 0 ? (
                <>
                  <div className="new-wishlist-section">
                    <div className="row">
                      <h2 className="mb-3">My Selections</h2>
                      {checkList.map((product) => (
                        <div key={product?.id} className="col-md-6 col-lg-3">
                          <div className="card">
                            <img
                              className=""
                              src={product?.image}
                              alt={product?.name}
                            />
                            <div className="card-body text-center">
                              <div className="cvp">
                                <h5 className="card-title fw-bolder">
                                  {/* Use next/link */}
                                  <Link
                                    href={`/shopdetails/${product?.id}`}
                                    className="product_data"
                                  >
                                    {product?.name}
                                  </Link>
                                </h5>

                                <div className="wishlist_item_btn">
                                  <button
                                    className="btn btn-danger remove"
                                    onClick={() =>
                                      removeFromWishList(product?.id)
                                    }
                                    disabled={removingItemId === product?.id}
                                  >
                                    {removingItemId === product?.id ? (
                                      <CgSpinner
                                        size={20}
                                        className="animate_spin me-2"
                                      />
                                    ) : (
                                      <AiFillDelete className="me-1" />
                                    )}
                                    REMOVE
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <div className="card border shadow-sm p-4">
                      <div className="text-center mb-4">
                        <h2 className="card-title mb-0">My Selections</h2>
                      </div>
                      <div className="text-center my-4">
                        <img
                          src='/assets/images/empty-cart.png'
                          alt="Empty Cart Illustration"
                          className="img-fluid mb-3"
                          style={{ maxWidth: "200px" }}
                        />
                        <h5 className="text-muted mb-3">
                          Oops! Your Selections is empty.
                        </h5>
                        <p className="text-muted">
                          Explore our collection and add your favourite products
                          in your Selections
                        </p>
                      </div>

                      <div className="text-center">
                        {/* Use next/link */}
                        <Link
                          href="/shop"
                          className="view_all_btn px-4 py-2"
                          style={{ borderRadius: "8px" }}
                        >
                          <FaLongArrowAltLeft className="mr-2" /> &nbsp;Back to
                          Shop
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default DealerWishList;