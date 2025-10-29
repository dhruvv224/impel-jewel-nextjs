'use client'; // ⬅️ REQUIRED: Uses state, effects, local storage, and context.

import React, { useContext, useState, useEffect } from "react";
// ✅ Next.js App Router replacements
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import Head from "next/head"; // Replaces Helmet

import Userservice from "../services/Auth";
import { CgSpinner } from "react-icons/cg";
import { WishlistSystem } from "../context/WishListContext";
import UserCartService from "../services/Cart";
import toast from "react-hot-toast";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { AiFillDelete } from "react-icons/ai";
import { CartSystem } from "../context/CartContext";
import Loader from "../components/common/Loader";

const WishList = () => {
  // Accessing localStorage is safe within a 'use client' component.
  const phone = localStorage.getItem("phone");
  const { dispatch: addtocartDispatch } = useContext(CartSystem);
  const { dispatch: removeWishlistDispatch } = useContext(WishlistSystem);

  // ✅ Next.js Router for programmatic navigation
  const router = useRouter(); 

  const [items, setItems] = useState([]);
  const [removingItemId, setRemovingItemId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productQuantity, setProductQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [removeCartItems, setRemoveCartItems] = useState(null);

  const GetUserWishlist = async () => {
    // Only attempt to fetch if phone is available
    if (!phone) {
        setIsLoading(false);
        return;
    }
    
    Userservice.userWishlist({ phone: phone })
      .then((res) => {
        setItems(res?.data?.wishlist_items);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const GetUserCartList = async () => {
    if (!phone) return;
    
    UserCartService.CartList({ phone: phone })
      .then((res) => {
        setCartItems(res.data.cart_items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeFromWishList = (id) => {
    const payload = id;
    setRemovingItemId(id);
    Userservice.removetoWishlist({ phone: phone, design_id: id })
      .then((res) => {
        if (res.success === true) {
          GetUserWishlist();

          toast.success(res.message);
          removeWishlistDispatch({
            type: "REMOVE_FROM_WISHLIST",
            payload,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setRemovingItemId(null);
      });
  };

  const handleAddToCart = (product) => {
    const payload = { id: product.id };
    setRemoveCartItems(product);
    const CartData = {
      phone: phone,
      design_name: product.name,
      design_id: product.id,
      quantity: productQuantity,
      gold_color: product?.gold_color,
      gold_type: product?.gold_type,
    };

    UserCartService.AddtoCart(CartData)
      .then((res) => {
        if (res.status === true) {
          GetUserCartList();
          GetUserWishlist();
          addtocartDispatch({
            type: "ADD_TO_CART",
            payload,
          });
          removeWishlistDispatch({
            type: "REMOVE_FROM_WISHLIST",
            payload,
          });
          toast.success(res.message);
        } else {
          toast.error(res.message);
          GetUserWishlist();
          removeWishlistDispatch({
            type: "REMOVE_FROM_WISHLIST",
            payload,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setRemoveCartItems(null);
      });
  };

  useEffect(() => {
    GetUserWishlist();
    GetUserCartList();
  }, [phone]); // Added 'phone' to dependency array

  const goldColor = {
    yellow_gold: "Yellow Gold",
    rose_gold: "Rose Gold",
    white_gold: "White Gold",
  };

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN")?.format(Math?.round(value));

  return (
    <>
      {/* ✅ Replaced Helmet with Next.js Head component for metadata */}
      <Head>
        <title>Impel Store - Wishlist</title>
      </Head>
      <section className="wishlist">
        <div className="container">
          <div>
            {isLoading ? (
              <Loader />
            ) : (
              <>
                {items?.length ? (
                  <>
                    <div className="new-wishlist-section">
                      <div className="row">
                        <h2 className="text-center pb-3 text-uppercase fw-bolder">
                          My Wishlist
                        </h2>
                        {items?.map((product) => {
                          return (
                            <div className="col-md-6 col-lg-3" key={product.id}>
                              <div className="card">
                                <Link
                                  // ✅ Next.js Link uses 'href'
                                  href={`/shopdetails/${product?.id}`}
                                  className="product_data"
                                >
                                  <img
                                    className=""
                                    src={product?.image}
                                    alt={product?.name}
                                  />
                                </Link>
                                <div className="card-body text-center">
                                  <div className="cvp">
                                    <h5 className="card-title fw-bolder">
                                      <Link
                                        // ✅ Next.js Link uses 'href'
                                        href={`/shopdetails/${product?.id}`}
                                        className="product_data"
                                      >
                                        {product?.name}
                                      </Link>
                                    </h5>
                                    <p>{goldColor[product.gold_color]}</p>
                                    <p>{product.gold_type}</p>
                                    <div className="mt-3">
                                      {product.gold_type == "22k" && (
                                        <h6>
                                          ₹
                                          {numberFormat(
                                            product?.total_amount_22k
                                          )}
                                        </h6>
                                      )}

                                      {product.gold_type == "20k" && (
                                        <h6>
                                          ₹
                                          {numberFormat(
                                            product?.total_amount_20k
                                          )}
                                        </h6>
                                      )}

                                      {/* {product.gold_type == "18k" && (
                                        <h6>₹{product?.total_amount_18k}</h6>
                                      )} */}

                                      {product.gold_type == "18k" && (
                                        <h6>
                                          ₹
                                          {numberFormat(
                                            product?.total_amount_18k
                                          )}
                                        </h6>
                                      )}

                                      {product.gold_type == "14k" && (
                                        <h6>
                                          ₹
                                          {numberFormat(
                                            product?.total_amount_14k
                                          )}
                                        </h6>
                                      )}
                                    </div>

                                    <div className="wishlist_item_btn">
                                      <button
                                        className="btn btn-danger remove"
                                        onClick={() =>
                                          removeFromWishList(product?.id)
                                        }
                                      >
                                        {removingItemId === product.id && (
                                          <CgSpinner
                                            size={20}
                                            className="animate_spin me-2"
                                          />
                                        )}
                                        {removingItemId === product.id ? (
                                          ""
                                        ) : (
                                          <>
                                            <AiFillDelete className="me-1" />
                                          </>
                                        )}
                                        REMOVE
                                      </button>

                                      <button
                                        className="btn btn-dark add-cart"
                                        onClick={() => handleAddToCart(product)}
                                      >
                                        {removeCartItems === product && (
                                          <CgSpinner
                                            size={20}
                                            className="animate_spin me-2"
                                          />
                                        )}
                                        {removeCartItems === product ? (
                                          ""
                                        ) : (
                                          <>
                                            <FaCartShopping className="me-1" />
                                          </>
                                        )}
                                        MOVE TO CART
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="row justify-content-center">
                    <div className="col-lg-8">
                      <div className="card border shadow-sm p-4">
                        <div className="text-center mb-4">
                          <h2 className="card-title mb-0">My Wishlist</h2>
                        </div>
                        <div className="text-center my-4">
                          <img
                            src='/assets/images/empty-wishlist.png'
                            alt="Empty Cart Illustration"
                            className="img-fluid mb-3"
                            style={{ maxWidth: "200px" }}
                          />
                          <h5 className="text-muted mb-3">
                            Oops! Your Wishlist is empty.
                          </h5>
                          <p className="text-muted">
                            Explore our collection and add your favourite
                            products in your wishlist
                          </p>
                        </div>

                        <div className="text-center">
                          <Link
                            // ✅ Next.js Link uses 'href'
                            href="/shop" 
                            className="view_all_btn px-4 py-2"
                            style={{ borderRadius: "8px" }}
                          >
                            <FaLongArrowAltLeft className="mr-2" /> &nbsp;Back
                            to Shop
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default WishList;