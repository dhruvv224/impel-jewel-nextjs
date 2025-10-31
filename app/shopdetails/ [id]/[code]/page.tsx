'use client'; // ⬅️ CRUCIAL: Must be a Client Component to use hooks like useState, useEffect, useContext, and useQuery.

import React, { Suspense, useContext, useEffect, useState } from "react";
// Next.js App Router imports for routing and URL params
import Link from "next/link"; 
import { usePathname, useRouter, useSearchParams } from "next/navigation"; // ⬅️ Replaces useLocation, useNavigate, and logic for useParams
import Head from "next/head"; // ⬅️ Replaces react-helmet-async

// import BreadCrumb from "./";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import toast from "react-hot-toast";
import { RxCross1 } from "react-icons/rx";
import { BsCartDash, BsHandbagFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import { FaHeart, FaLongArrowAltLeft, FaRegHeart } from "react-icons/fa";
// The original import for Helmet is replaced by the next/head component or the Next.js Metadata API.
import { WishlistSystem } from "../../../context/WishListContext";
import UserCartService from "../../../services/Cart";
import Userservice from "../../../services/Auth";
import productDetail from "../../../services/Shop";
import { CartSystem } from "../../../context/CartContext";
import { Accordion } from "react-bootstrap";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { FaArrowLeftLong } from "react-icons/fa6";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import auth925 from "../../assets/images/Tags/Auth925.png";

const ShopDetailsInner = () => {
  // ❌ Original: const location = useLocation();
  // ❌ Original: const navigate = useNavigate();
  
  // ✅ Next.js App Router Replacements
  const router = useRouter(); 
  const pathname = usePathname(); // Equivalent to location.pathname
  const searchParams = useSearchParams(); 
  // ❌ Original: const { id } = useParams();
  // We use searchParams to get the ID since the original component used location.state/URL params heavily.
  const id = searchParams.get('id'); 

  // ❌ Original: const { id: categoryIdFromState, name: categoryNameFromState } = location.state || {};
  // Now fetching dynamic data from URL query params. Adjust this based on your actual URL structure.
  const categoryIdFromState = searchParams.get('categoryId') || id; 
  const categoryNameFromState = searchParams.get('categoryName'); 
  
  const { dispatch: wishlistDispatch } = useContext(WishlistSystem);
  const { dispatch: removeWishlistDispatch } = useContext(WishlistSystem);
  const { dispatch: addtocartDispatch } = useContext(CartSystem);
  const loginPath = sessionStorage.getItem("currentPath");

  const Dealer = localStorage.getItem("email");
  const Phone = localStorage.getItem("phone");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [UserWishlistItems, setUserWishlistItems] = useState([]);
  const [goldColor, setGoldColor] = useState("yellow_gold");
  const [goldType, setGoldType] = useState("18k");
  const [spinner, setSpinner] = useState(false);
  const [spinner2, setSpinner2] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(true);

  const toggleAccordion = () => {
    setAccordionOpen(!accordionOpen);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product_detail", categoryIdFromState],
    queryFn: () =>
      productDetail.product_detail({
        id: categoryIdFromState,
      }),
    keepPreviousData: true,
    enabled: !!categoryIdFromState, // Only run the query if the ID is present
    onError: (err) => {
      console.log("Error fetching products details:", err);
    },
  });

  const product = data?.data || {};
  const img = data?.data?.image || "";
  const productImages = data?.data?.multiple_image || [];

  const GetUserCartList = async () => {
    UserCartService.CartList({ phone: Phone })
      .then((res) => {
        setCartItems(res.data.cart_items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const GetUserWishList = async () => {
    Userservice.userWishlist({ phone: Phone })
      .then((res) => {
        setUserWishlistItems(res?.data?.wishlist_items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    GetUserCartList();
    GetUserWishList();
  }, [Phone]); // Added Phone dependency to useEffect

  const addToUserWishList = async (product) => {
    setSpinner2(true);
    const payload = { id: product?.id };
    Userservice.addtoWishlist({
      phone: localStorage.getItem("phone"),
      design_id: product?.id,
      quantity: 1,
      gold_color: goldColor,
      gold_type: goldType,
      design_name: product?.name,
    })
      .then((res) => {
        if (res.success === true) {
          GetUserWishList();
          wishlistDispatch({
            type: "ADD_TO_WISHLIST",
            payload,
          });
          toast.success("Added to Wishlist!");
        } else {
            toast.error(res.message || "Failed to add to wishlist.");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred.");
      })
      .finally(() => {
        setSpinner2(false);
      });
  };

  const handleAddToCart = (product) => {
    setSpinner(true);
    const payload = { id: product?.id };
    const CartData = {
      phone: Phone,
      design_name: product?.name,
      design_id: product?.id,
      quantity: 1,
      gold_color: goldColor,
      gold_type: goldType,
    };

    const isItemInWishlist = UserWishlistItems.some(
      (wishlistItem) =>
        wishlistItem.design_id === product?.id &&
        wishlistItem.goldType === product?.goldType &&
        wishlistItem.goldColor === product?.goldColor
    );

    UserCartService.AddtoCart(CartData)
      .then((res) => {
        if (res.status === true) {
          GetUserCartList();
          addtocartDispatch({
            type: "ADD_TO_CART",
            payload,
          });
          if (isItemInWishlist) {
            removeWishlistDispatch({
              type: "REMOVE_FROM_WISHLIST",
              payload: { id: product?.id },
            });
          }
          toast.success(res.message);
        } else {
             toast.error(res.message || "Failed to add to cart.");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred.");
      })
      .finally(() => {
        setSpinner(false);
      });
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateLightbox = (step) => {
    const newIndex =
      (currentImageIndex + step + productImages?.length) %
      productImages?.length;
    setCurrentImageIndex(newIndex);
  };

  const handleGoldColor = (goldType) => {
    setGoldColor(goldType);
    setGoldType("18k");
  };

  const handleGoldType = (event) => {
    setGoldType(event.target.id);
  };

  const productdetail = {
    // details for 22k gold
    gross_weight_22k: product?.gross_weight_22k?.toFixed(3),
    less_gems_stone: product?.less_gems_stone?.toFixed(2),
    less_cz_stone: product?.less_cz_stone?.toFixed(2),
    net_weight_22k: product?.net_weight_22k?.toFixed(3),
    cz_stone_price: product?.cz_stone_price?.toFixed(2),
    gemstone_price: product?.gemstone_price?.toFixed(2),

    // details for 20k gold
    gross_weight_20k: product?.gross_weight_20k?.toFixed(3),
    less_gems_stone: product?.less_gems_stone?.toFixed(2),
    less_cz_stone: product?.less_cz_stone?.toFixed(2),
    net_weight_20k: product?.net_weight_20k?.toFixed(3),
    cz_stone_price: product?.cz_stone_price?.toFixed(2),
    gemstone_price: product?.gemstone_price?.toFixed(2),

    // details for 18k gold`
    gross_weight_18k: product?.gross_weight_18k?.toFixed(3),
    less_gems_stone: product?.less_gems_stone?.toFixed(2),
    less_cz_stone: product?.less_cz_stone?.toFixed(2),
    net_weight_18k: product?.net_weight_18k?.toFixed(3),
    cz_stone_price: product?.cz_stone_price?.toFixed(2),
    gemstone_price: product?.gemstone_price?.toFixed(2),

    // details for 14k gold
    gross_weight_14k: product?.gross_weight_14k?.toFixed(3),
    less_gems_stone: product?.less_gems_stone?.toFixed(2),
    less_cz_stone: product?.less_cz_stone?.toFixed(2),
    net_weight_14k: product?.net_weight_14k?.toFixed(3),
    cz_stone_price: product?.cz_stone_price?.toFixed(2),
    gemstone_price: product?.gemstone_price?.toFixed(2),
  };

  const UserLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("redirectPath", pathname); // ✅ Use next/navigation's pathname
    // ✅ Use router.push with a query parameter for state
    router.push(`/login?from=${encodeURIComponent(pathname)}`); 
  };

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN")?.format(Math?.round(value));
    
  const handleBackClick = () => {
    // Check the previous page's path
    console.log(loginPath,"::prev page")
    // If coming from login page, redirect to /shop
    if (loginPath?.includes('/login')) {
      router.push('/shop'); // ✅ Use Next.js router.push
    } else {
      router.back(); // ✅ Use Next.js router.back() (equivalent to navigate(-1))
    }
  };
  
  return (
    <>
      {/* ❌ Removed: <Helmet>...</Helmet> */}
      <Head> {/* ✅ Next.js alternative for setting metadata in a Client Component */}
        <title>
          Impel Store - &nbsp;
          {product?.name && product?.code
            ? `${product.name} (${product.code})`
            : "Product Details"}
        </title>
        <meta name="description" content="Product details page" />
      </Head>

      <section className="shop_details">
        <div className="container">
          <div className="Shop_product">
            <div className="row justify-content-center">
              <div className="col-md-10">
                <div className="breadcumb-section-btn mb-4">
                  {/* <BreadCrumb
                    firstName="Home"
                    firstUrl='/'
                    secondName="Shop"
                    secondUrl='/shop'
                    thirdName="Shopdetails"
                  /> */}
                  <button
                    className="btn btn-outline-dark d-flex align-items-center text-center"
                    onClick={() => router.back()} // ✅ Use Next.js router.back()
                  >
                    <FaArrowLeftLong />
                  </button>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    {isLoading ? (
                      <>
                        <Skeleton style={{ height: "526px" }} width="100%" />
                      </>
                    ) : isError ? (
                      <div>Error: {error?.message}</div>
                    ) : (
                      <>
                        <div>
                          {productImages?.length === 0 ? (
                            <div id="imageMagnifyer">
                              <motion.img
                                src={img}
                                alt=""
                                className="w-100"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          ) : (
                            <div className="detalis_slider">
                              <Carousel
                                infiniteLoop
                                useKeyboardArrows
                                autoPlay
                                interval={3000}
                              >
                                {productImages?.map((image, index) => (
                                  <div
                                    key={index}
                                    onClick={() => openLightbox(index)}
                                  >
                                    <motion.img
                                      src={image}
                                      alt=""
                                      className="w-100"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.5 }}
                                    />
                                  </div>
                                ))}
                              </Carousel>

                              {lightboxOpen && (
                                <div className="custom-lightbox">
                                  <div className="custom_lightbox_inr">
                                    <span
                                      className="close-button"
                                      onClick={closeLightbox}
                                    >
                                      <RxCross1 />
                                    </span>
                                    <motion.img
                                      src={productImages[currentImageIndex]}
                                      alt=""
                                      className="w-50"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.5 }}
                                    />
                                    <div className="lightbox-navigation">
                                      <button
                                        onClick={() => navigateLightbox(-1)}
                                        className="prev-button-swiper ms-2"
                                      >
                                        <MdKeyboardArrowLeft className="swiper-icon" />
                                      </button>
                                      <button
                                        onClick={() => navigateLightbox(1)}
                                        className="next-button-swiper me-2"
                                      >
                                        <MdKeyboardArrowRight className="swiper-icon" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="col-md-6 product-details-content">
                    {isLoading ? (
                      <>
                        <Skeleton height={30} width="60%" />
                        <Skeleton height={20} width="40%" className="my-2" />
                        <Skeleton height={20} width="50%" className="my-2" />
                        <Skeleton height={20} width="70%" className="my-2" />
                        <Skeleton height={150} width="100%" className="mt-3" />
                        <Skeleton height={30} width="100%" className="mt-3" />
                      </>
                    ) : (
                      <>
                        <div>
                          <h3>{product?.name}</h3>
                          <h5 className="mb-3">
                            Design code : <strong>{product?.code}</strong>
                          </h5>
                          {product?.description && (
                            <p>{product?.description}</p>
                          )}

                          <div>
                            <div>
                              <button
                                className={`yellow-gold ${
                                  goldColor === "yellow_gold" ? "active" : ""
                                }`}
                                onClick={() => handleGoldColor("yellow_gold")}
                              >
                                Yellow Gold
                              </button>
                              <button
                                className={`rose-gold  mx-3 ${
                                  goldColor === "rose_gold" ? "active" : ""
                                }`}
                                onClick={() => handleGoldColor("rose_gold")}
                              >
                                Rose Gold
                              </button>
                              <button
                                className={`white-gold  mt-md-0 mt-3 ${
                                  goldColor === "white_gold" ? "active" : ""
                                }`}
                                onClick={() => handleGoldColor("white_gold")}
                              >
                                White Gold
                              </button>
                            </div>
                            <div className="mt-3">
                              {goldColor === "yellow_gold" && (
                                <>
                                  <div className="crt-btn">
                                    <div className="radio-item">
                                      <input
                                        name="radio1"
                                        id="22k"
                                        type="radio"
                                        checked={goldType === "22k"}
                                        onChange={handleGoldType}
                                      />
                                      <label htmlFor="22k">22K</label>
                                    </div>
                                    <div className="radio-item">
                                      <input
                                        name="radio1"
                                        id="20k"
                                        type="radio"
                                        checked={goldType === "20k"}
                                        onChange={handleGoldType}
                                      />
                                      <label htmlFor="20k">20K</label>
                                    </div>
                                    <div className="radio-item">
                                      <input
                                        name="radio1"
                                        id="18k"
                                        type="radio"
                                        defaultChecked={goldType === "18k"}
                                        onChange={handleGoldType}
                                      />
                                      <label htmlFor="18k">18K</label>
                                    </div>
                                    <div className="radio-item">
                                      <input
                                        name="radio1"
                                        id="14k"
                                        type="radio"
                                        checked={goldType === "14k"}
                                        onChange={handleGoldType}
                                      />
                                      <label htmlFor="14k">14K</label>
                                    </div>
                                  </div>
                                </>
                              )}
                              {goldColor === "rose_gold" && (
                                <>
                                  <div className="d-flex">
                                    <div className="radio-item">
                                      <input
                                        name="radio1"
                                        id="18k"
                                        type="radio"
                                        defaultChecked={goldType === "18k"}
                                        onChange={handleGoldType}
                                      />
                                      <label htmlFor="18k">18K</label>
                                    </div>
                                    <div className="radio-item ms-3">
                                      <input
                                        name="radio1"
                                        id="14k"
                                        type="radio"
                                        checked={goldType === "14k"}
                                        onChange={handleGoldType}
                                      />
                                      <label htmlFor="14k">14K</label>
                                    </div>
                                  </div>
                                </>
                              )}
                              {goldColor === "white_gold" && (
                                <>
                                  <div className="d-flex ">
                                    <div className="radio-item">
                                      <input
                                        name="radio1"
                                        id="18k"
                                        type="radio"
                                        defaultChecked={goldType === "18k"}
                                        onChange={handleGoldType}
                                      />
                                      <label htmlFor="18k">18K</label>
                                    </div>
                                    <div className="radio-item ms-3">
                                      <input
                                        name="radio1"
                                        id="14k"
                                        type="radio"
                                        checked={goldType === "14k"}
                                        onChange={handleGoldType}
                                      />
                                      <label htmlFor="14k">14K</label>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="mt-3">
                              <Accordion className="accordian">
                                <Accordion.Item eventKey="3" className="my-2">
                                  <Accordion.Header onClick={toggleAccordion}>
                                    Approximate - Estimate
                                  </Accordion.Header>
                                  <Accordion.Body className="p-0">
                                    <div>
                                      {goldColor && goldType && (
                                        <>
                                          <table className="table table-bordered mb-0">
                                            <tbody>
                                              {goldType === "22k" && (
                                                <>
                                                  <tr>
                                                    <th>Gross Weight</th>
                                                    <td>
                                                      {
                                                        productdetail?.gross_weight_22k
                                                      }
                                                      g. (Approx.)
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <th>Net Weight</th>
                                                    <td>
                                                      {
                                                        productdetail?.net_weight_22k
                                                      }
                                                      g. (Approx.)
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <th>Metal value</th>
                                                    <td>
                                                      ₹
                                                      {numberFormat(
                                                        product?.metal_value_22k
                                                      )}
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <th>Making charge</th>
                                                    <td>
                                                      ₹
                                                      {(product?.making_charge_discount_22k >
                                                        0 &&
                                                        Phone) ||
                                                      Dealer ? (
                                                        <>
                                                          <del>
                                                            {numberFormat(
                                                              product?.making_charge_22k
                                                            )}
                                                          </del>
                                                          &nbsp; (
                                                          {
                                                            product?.sales_westage_discount
                                                          }
                                                          % Off) &nbsp;
                                                          <strong>
                                                            {numberFormat(
                                                              product?.making_charge_discount_22k
                                                            )}
                                                          </strong>
                                                        </>
                                                      ) : (
                                                        <>
                                                          <strong>
                                                            {numberFormat(
                                                              product?.making_charge_22k
                                                            )}
                                                          </strong>
                                                        </>
                                                      )}
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <th>Total Amount</th>
                                                    <td>
                                                      {Phone || Dealer ? (
                                                        <strong className="text-success">
                                                          ₹
                                                          {numberFormat(
                                                            product?.total_amount_22k
                                                          )}
                                                          &nbsp; (Approx.)
                                                        </strong>
                                                      ) : (
                                                        <strong className="text-success">
                                                          ₹
                                                          {numberFormat(
                                                            product?.metal_value_22k +
                                                              product?.making_charge_22k
                                                          )}
                                                          &nbsp; (Approx.)
                                                        </strong>
                                                      )}
                                                    </td>
                                                  </tr>
                                                </>
                                              )}
                                              {goldType === "20k" && (
                                                <>
                                                  <tr>
                                                    <th>Gross Weight</th>
                                                    <td>
                                                      {
                                                        productdetail?.gross_weight_20k
                                                      }
                                                      g. (Approx.)
                                                    </td>
                                                  </tr>
                                                  {/* <tr>
                                            <th>Less Gems Stone</th>
                                            <td>
                                              {productdetail?.less_gems_stone}
                                              g.
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Less C.Z. Stone</th>
                                            <td>
                                              {productdetail?.less_cz_stone}
                                              g.
                                            </td>
                                          </tr> */}
                                                  <tr>
                                                    <th>Net Weight</th>
                                                    <td>
                                                      {
                                                        productdetail?.net_weight_20k
                                                      }
                                                      g.
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <th>Metal value</th>
                                                    <td>
                                                      ₹
                                                      {numberFormat(
                                                        product?.metal_value_20k
                                                      )}
                                                    </td>
                                                  </tr>
                                                  {/* <tr>
                                            <th>CZ Stone Charges</th>
                                            <td>
                                              ₹{productdetail?.cz_stone_price}
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Gem stone charges</th>
                                            <td>
                                              ₹{productdetail?.gemstone_price}
                                            </td>
                                          </tr> */}
                                                  <tr>
                                                    <th>Making charge</th>
                                                    <td>
                                                      ₹
                                                      {(product?.making_charge_discount_20k >
                                                        0 &&
                                                        Phone) ||
                                                      Dealer ? (
                                                        <>
                                                          <del>
                                                            {numberFormat(
                                                              product?.making_charge_20k
                                                            )}
                                                          </del>
                                                          &nbsp; (
                                                          {
                                                            product?.sales_westage_discount
                                                          }
                                                          % Off) &nbsp;{" "}
                                                          <strong>
                                                            ₹
                                                            {numberFormat(
                                                              product?.making_charge_discount_20k
                                                            )}
                                                          </strong>
                                                        </>
                                                      ) : (
                                                        <>
                                                          <strong>
                                                            {" "}
                                                            {numberFormat(
                                                              product?.making_charge_20k
                                                            )}
                                                          </strong>
                                                        </>
                                                      )}
                                                    </td>
                                                  </tr>
                                                  <tr>
  <th>Total Amount</th>
  <td>
    {Phone || Dealer ? (
      <strong className="text-success">
        ₹
        {numberFormat(product?.total_amount_20k)}
        &nbsp; (Approx.)
      </strong>
    ) : (
      <strong className="text-success">
        ₹
        {numberFormat(
          product?.metal_value_20k + product?.making_charge_20k
        )}
        &nbsp; (Approx.)
      </strong>
    )}
  </td>
</tr>

                                                </>
                                              )}
                                              {goldType === "18k" && (
                                                <>
                                                  <tr>
                                                    <th>Gross Weight</th>
                                                    <td>
                                                      {
                                                        productdetail?.gross_weight_18k
                                                      }
                                                      g. (Approx.)
                                                    </td>
                                                  </tr>
                                                  {/* <tr>
                                            <th>Less Gems Stone</th>
                                            <td>
                                              {productdetail?.less_gems_stone}
                                              g.
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Less C.Z. Stone</th>
                                            <td>
                                              {productdetail?.less_cz_stone}
                                              g.
                                            </td>
                                          </tr> */}
                                                  <tr>
                                                    <th>Net Weight</th>
                                                    <td>
                                                      {
                                                        productdetail?.net_weight_18k
                                                      }
                                                      g.
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <th>Metal value</th>
                                                    <td>
                                                      ₹
                                                      {numberFormat(
                                                        product?.metal_value_18k
                                                      )}
                                                    </td>
                                                  </tr>
                                                  {/* <tr>
                                            <th>CZ Stone Charges</th>
                                            <td>
                                              ₹{productdetail?.cz_stone_price}
                                            </td>
                                          </tr>
                                          <tr>
                                            <th>Gem stone charges</th>
                                            <td>
                                              ₹{productdetail?.gemstone_price}
                                            </td>
                                          </tr> */}
                                                  <tr>
                                                    <th>Making charge</th>
                                                    <td>
                                                      ₹
                                                      {(product?.making_charge_discount_18k >
                                                        0 &&
                                                        Phone) ||
                                                      Dealer ? (
                                                        <>
                                                          <del>
                                                            {numberFormat(
                                                              product?.making_charge_18k
                                                            )}
                                                          </del>
                                                          &nbsp; (
                                                          {
                                                            product?.sales_westage_discount
                                                          }
                                                          % Off) &nbsp;{" "}
                                                          <strong>
                                                            ₹
                                                            {numberFormat(
                                                              product?.making_charge_discount_18k
                                                            )}
                                                          </strong>
                                                        </>
                                                      ) : (
                                                        <>
                                                          <strong>
                                                            {numberFormat(
                                                              product?.making_charge_18k
                                                            )}
                                                          </strong>
                                                        </>
                                                      )}
                                                    </td>
                                                  </tr>

                                                  <tr>
                                                    <th>Total Amount</th>
                                                    <td>
                                                      {Phone || Dealer ? (
                                                        <strong className="text-success">
                                                          ₹
                                                          {numberFormat(
                                                            product?.total_amount_18k
                                                          )}
                                                          &nbsp; (Approx.)
                                                        </strong>
                                                      ) : (
                                                        <strong className="text-success">
                                                          ₹
                                                          {numberFormat(
                                                            product?.making_charge_18k +
                                                              product?.metal_value_18k
                                                          )}
                                                          &nbsp; (Approx.)
                                                        </strong>
                                                      )}
                                                    </td>
                                                  </tr>
                                                </>
                                              )}
                                        {goldType === "14k" && (
  <>
    <tr>
      <th>Gross Weight</th>
      <td>{productdetail?.gross_weight_14k} g. (Approx.)</td>
    </tr>

    <tr>
      <th>Less Gems Stone</th>
      <td>{productdetail?.less_gems_stone} g.</td>
    </tr>

    <tr>
      <th>Less C.Z. Stone</th>
      <td>{productdetail?.less_cz_stone} g.</td>
    </tr>

    <tr>
      <th>Net Weight</th>
      <td>{productdetail?.net_weight_14k} g.</td>
    </tr>

    <tr>
      <th>Metal value</th>
      <td>₹{numberFormat(product?.metal_value_14k)}</td>
    </tr>

    <tr>
      <th>Making charge</th>
      <td>
        ₹
        {(product?.making_charge_discount_14k > 0 && Phone) || Dealer ? (
          <>
            <del>{numberFormat(product?.making_charge_14k)}</del>
            &nbsp; ({numberFormat(product?.sales_westage_discount)}% Off) &nbsp;
            <strong>
              ₹{numberFormat(product?.making_charge_discount_14k)}
            </strong>
          </>
        ) : (
          <>
            <strong>₹{numberFormat(product?.making_charge_14k)}</strong>
          </>
        )}
      </td>
    </tr>

    <tr>
      <th>Total Amount</th>
      <td>
        {Phone || Dealer ? (
          <strong className="text-success">
            ₹{numberFormat(product?.total_amount_14k)} &nbsp; (Approx.)
          </strong>
        ) : (
          <strong className="text-success">
            ₹
            {numberFormat(
              product?.making_charge_14k + product?.metal_value_14k
            )}
            &nbsp; (Approx.)
          </strong>
        )}
      </td>
    </tr>
  </>
)}

                                            </tbody>
                                          </table>
                                        </>
                                      )}
                                    </div>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            </div>
                            {accordionOpen && (
                              <div className="mt-3">
                                {goldColor && goldType && (
                                  <>
                                    <table className="table table-bordered">
                                      <tbody>
                                        {goldType === "22k" && (
                                          <tr>
                                            <th>Total Amount</th>
                                            <td>
                                              ₹
                                              {Phone || Dealer ? (
                                                <>
                                                  {numberFormat(
                                                    product?.total_amount_22k
                                                  )}
                                                </>
                                              ) : (
                                                <>
                                                  {numberFormat(
                                                    product?.metal_value_22k +
                                                      product?.making_charge_22k
                                                  )}
                                                </>
                                              )}
                                              (Approx.)
                                            </td>
                                          </tr>
                                        )}
                                        {goldType === "20k" && (
                                          <tr>
                                            <th>Total Amount</th>
                                            <td>
                                              ₹
                                              {Phone || Dealer ? (
                                                <>
                                                  {numberFormat(
                                                    product?.total_amount_20k
                                                  )}
                                                </>
                                              ) : (
                                                <>
                                                  {numberFormat(
                                                    product?.metal_value_20k +
                                                      product?.making_charge_20k
                                                  )}
                                                </>
                                              )}
                                              (Approx.)
                                            </td>
                                          </tr>
                                        )}
                                        {goldType === "18k" && (
                                          <tr>
                                            <th>Total Amount</th>
                                            <td>
                                              ₹
                                              {Phone || Dealer ? (
                                                <>
                                                  {numberFormat(
                                                    product?.total_amount_18k
                                                  )}
                                                </>
                                              ) : (
                                                <>
                                                  {numberFormat(
                                                    product?.metal_value_18k +
                                                      product?.making_charge_18k
                                                  )}
                                                </>
                                              )}
                                              (Approx.)
                                            </td>
                                          </tr>
                                        )}
                                        {goldType === "14k" && (
                                          <tr>
                                            <th>Total Amount</th>
                                            <td>
                                              ₹
                                              {Phone || Dealer ? (
                                                <>
                                                  {numberFormat(
                                                    product?.total_amount_14k
                                                  )}
                                                </>
                                              ) : (
                                                <>
                                                  {numberFormat(
                                                    product?.metal_value_14k +
                                                      product?.making_charge_14k
                                                  )}
                                                </>
                                              )}
                                              (Approx.)
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                       <div className="d-flex align-items-center gap-2 pt-2">
                            {Phone ? (
                              <>
                                {cartItems?.find((item) => item?.design_id === product?.id) ? (
                                  // ⬅️ Next.js Link
                                  <Link className="btn btn-outline-dark" href="/cart">
                                    <BsCartDash style={{ fontSize: "26px", cursor: "pointer" }} />
                                  </Link>
                                ) : (
                                  <>
                                    <button
                                      className="btn btn-outline-dark"
                                      onClick={() => handleAddToCart(product)}
                                      disabled={spinner}
                                    >
                                      {spinner ? (
                                        <CgSpinner size={20} className="animate_spin" />
                                      ) : (
                                        <BsHandbagFill style={{ fontSize: "26px", cursor: "pointer" }} />
                                      )}
                                    </button>

                                    <button
                                      className="btn btn-outline-dark"
                                      onClick={() => addToUserWishList(product)}
                                      disabled={UserWishlistItems?.some(
                                        (item) => item?.design_id === product?.id
                                      )}
                                    >
                                      {UserWishlistItems?.some((item) => item?.design_id === product?.id) ? (
                                        <FaHeart
                                          style={{ fontSize: "26px", cursor: "pointer", color: "green" }}
                                        />
                                      ) : spinner2 ? (
                                        <CgSpinner size={20} className="animate_spin" />
                                      ) : (
                                        <FaRegHeart style={{ fontSize: "26px", cursor: "pointer" }} />
                                      )}
                                    </button>
                                  </>
                                )}
                              </>
                            ) : Dealer ? (
                              <></>
                            ) : (
                              <div
                                className="d-flex align-items-center gap-2"
                                onClick={(e) => UserLogin(e)}
                              >
                                <span className="btn btn-outline-dark">
                                  <BsHandbagFill style={{ fontSize: "26px", cursor: "pointer" }} />
                                </span>
                                <span className="btn btn-outline-dark">
                                  <FaRegHeart style={{ fontSize: "26px", cursor: "pointer" }} />
                                </span>
                              </div>
                            )}

                            {/* Back to shop inline with others */}
                            <button
                                  className="btn btn-outline-dark px-4 d-flex align-items-center"
                                  style={{ borderRadius: "8px" }}
                                onClick={handleBackClick}
                                >
                                  <FaLongArrowAltLeft className="me-2" size={18} />
                                  Back to Shop 
                                </button>
                        </div>



                         
                            <>
                              {cartItems &&
                              cartItems.find(
                                (item) => item?.design_id === product?.id
                              ) ? (
                                ""
                              ) : (
                                <div className="discount-info">
                                  <span>
                                    To get Maximum Discount apply coupon code in
                                    cart.
                                  </span>
                                </div>
                              )}
                            </>

                          <div className="design_details_spec">
                            <div className="design_details_spec_box">
                              <img src='/assets/images/Tags/Warranty.png' alt="easy_return" />
                              <span>Easy 7 Days Return Policy</span>
                            </div>
                            <div className="design_details_spec_box">
                              <img src='/assets/images/Tags/Jewellery.png' alt="Lifetime Plating" />
                              <span>Free Life Time Plating</span>
                            </div>
                            <div className="design_details_spec_box">
                              <img src='/assets/images/Tags/Auth925.png' alt="easy_return" />
                              <span>Authentic 925 Silver</span>
                            </div>
                            {/* <div className="design_details_spec_box">
                              <svg
                                width="30"
                                height="30"
                                viewBox="0 0 33 27"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.7222 1H31.5555V19.0556H10.7222V1Z"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>
                                <path
                                  d="M10.7222 7.94446H5.16667L1.00001 12.1111V19.0556H10.7222V7.94446Z"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>
                                <path
                                  d="M25.3055 26C23.3879 26 21.8333 24.4454 21.8333 22.5278C21.8333 20.6101 23.3879 19.0555 25.3055 19.0555C27.2232 19.0555 28.7778 20.6101 28.7778 22.5278C28.7778 24.4454 27.2232 26 25.3055 26Z"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>
                                <path
                                  d="M7.25001 26C5.33235 26 3.77778 24.4454 3.77778 22.5278C3.77778 20.6101 5.33235 19.0555 7.25001 19.0555C9.16766 19.0555 10.7222 20.6101 10.7222 22.5278C10.7222 24.4454 9.16766 26 7.25001 26Z"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>
                              </svg>
                              <span>Free Shipping on All Orders</span>
                            </div> */}
                            <div className="design_details_spec_box">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                fill="currentColor"
                                className="bi bi-currency-rupee"
                                viewBox="0 0 16 16"
                              >
                                <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
                              </svg>
                              <span>Cod Available</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const ShopDetails = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ShopDetailsInner />
  </Suspense>
);

export default ShopDetails;