"use client"
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import FilterServices from "./services/Filter";
import homeService from "./services/Home";

import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  EffectFade,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// import banner_1 from "../assets/images/bg-01.jpeg";
// import Ring from "../assets/images/ring.png";
// import Kada from "../assets/images/kada.jpg";
// import Gold_Ring from "../assets/images/gold_ring.png";
// import WomansClub from "../components/common/WomansClub";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import BannerShimmer from "./shimmer/BannerShimmer";

const Home = () => {
  // Utility to extract only text from HTML
  function extractTextFromHTML(html) {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  }
  const firstbannerRef = useRef(null);
  const secondbannerRef = useRef(null);
  const thirdbannerRef = useRef(null);
  const fourthbannerRef = useRef(null);
  const fifthbannerRef = useRef(null);

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupTimer,setPopupTimer] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, popupTimer);
    return () => clearTimeout(timer);
  }, []);

  const videoEl = useRef(null);

  const attemptPlay = () => {
    videoEl &&
      videoEl.current &&
      videoEl.current.play().catch((error) => {
        console.error("Error attempting to play", error);
      });
  };

  useLayoutEffect(() => {
    attemptPlay();
  }, []);

  const {
    data,
    isError,
    error,
    isLoading: isBannerLoading,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: () => homeService.banners(),
    keepPreviousData: true,
    onError: (err) => {
      console.log("Error fetching banner:", err);
    },
  });

  const bannerSlider = data?.data || [];
  const hero = Array.isArray(data?.data?.top_banners)
    ? data?.data?.top_banners
    : [];
  const middle_banners = Array.isArray(data?.data?.middle_banners)
    ? data?.data?.middle_banners
    : [];
  const bottom_banners = Array.isArray(data?.data?.bottom_banners)
    ? data?.data?.bottom_banners
    : [];

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => FilterServices.headerTags(),
    select: (data) => data?.data || [],
  });

  const { data: category } = useQuery({
    queryKey: ["category"],
    queryFn: () => homeService.category(),
    select: (data) => data?.data || [],
  });
  const { data: newAdd } = useQuery({
    queryKey: ["recentAdd"],
    queryFn: () => homeService.RecentAdd(),
    select: (data) => data?.data || [],
  });

  const { data: review } = useQuery({
    queryKey: ["TestiMonials"],
    queryFn: () => homeService.TestiMonials(),
    select: (data) => data?.data || [],
  });

  const { data: topSell } = useQuery({
    queryKey: ["TopSelling"],
    queryFn: () => homeService.TopSelling(),
    select: (data) => data?.data || [],
  });
 const { data: popupData } = useQuery({
    queryKey: [""],
    queryFn: () => homeService.GetPopUpData(),
    select: (data) => data?.data || [],
  });
  console.log(popupData,":::")
  useEffect(() => {
    if (popupData?.[0]?.duration) {
      setPopupTimer(popupData[0].timer);
    }
  }, [popupData]);

  // Control body scroll when popup is open
  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showPopup]);
  return (
    <>
      {/* Popup */}
      {showPopup && popupData?.[0] && (
  <div
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        setShowPopup(false);
      }
    }}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 9999,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.6)", // Darker overlay for focus
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "fadeIn 0.5s",
      backdropFilter: "blur(4px)", // Adds a subtle blur to the background
      cursor: "pointer", // Indicates clickable area
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}  // Prevent clicks inside popup from closing it
      style={{
        background: "#f0e1cc",
        borderRadius: "24px",
        boxShadow: "0 16px 64px rgba(0,0,0,0.3)", // Stronger, more prominent shadow
        padding: "48px 48px 36px 48px",
        maxWidth: "1100px", // Increased max-width for a bigger popup
        width: "90%",
        maxHeight: "90vh", // Maximum height of 90% of viewport height
        overflowY: "auto", // Add scrollbar to popup content if needed
        textAlign: "center",
        position: "relative",
        border: "1px solid #e0e0e0", // A subtle border
        overflowY: "auto", // Enable vertical scrolling
        msOverflowStyle: "none", // Hide scrollbar in IE and Edge
        scrollbarWidth: "none", // Hide scrollbar in Firefox
        "&::-webkit-scrollbar": { // Hide scrollbar in Chrome/Safari
          display: "none"
        }
      }}
    >
      <button
        onClick={() => setShowPopup(false)}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          border: "none",
          width: "30px",
          height: "30px",
          fontSize: "24px",
          cursor: "pointer",
          color: "#c9b290",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          zIndex: 10,
          lineHeight: "0",
          padding: "0",
          background: "transparent"
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        aria-label="Close"
      >
        ×
      </button>

      <div style={{
        border: "2px solid #c9b290",
        borderRadius: "16px",
        padding: "15px",
        margin: "-15px",
        position: "relative",
        height: "100%"
      }}>
        {popupData[0]?.image && (
          <img
            src={popupData[0]?.image}
            alt={popupData[0]?.title}
            style={{
              width: "100%", 
              height: "100%",
              objectFit: "cover",
              borderRadius: "12px", // Slightly reduced to account for parent border
            marginBottom: "36px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)", // A more impactful shadow
            border: "4px solid #bfa76f",
          }}
        />
      )}
      <h2
        style={{
          marginBottom: "16px",
          color: "#333", // Darker text for readability
          fontWeight: 700,
          fontSize: "2.2rem", // Bigger, more impactful headline
          letterSpacing: "-0.5px", // Subtle letter spacing adjustment
        }}
      >
        {popupData[0]?.title}
      </h2>
      <div
        style={{
          color: "#666", // Softer body text color
          fontSize: "18px", // Slightly larger body text
          lineHeight: "1.6", // Better line spacing for readability
          marginBottom: 0,
        }}
        dangerouslySetInnerHTML={{
          __html: popupData[0]?.description
        }}
        className="popup-content"
      />
      <button
        style={{
          background: "linear-gradient(to right, #c9b290, #bfa76f)",
          color: "#fff",
          border: "none",
          padding: "12px 30px",
          borderRadius: "25px",
          fontSize: "16px",
          fontWeight: "600",
          marginTop: "24px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 15px rgba(191, 167, 111, 0.2)",
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(191, 167, 111, 0.3)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(191, 167, 111, 0.2)';
        }}
        onClick={() => {
          setShowPopup(false);
          if (popupData[0]?.btn_url) {
            window.location.href = popupData[0].btn_url;
          }
        }}
      >
        { 'Explore Collection'}
      </button>
      </div>
     

    </div>
  </div>
)}

    
      {/* Hero Banner */}
      <section className="banner position-relative">
        {isBannerLoading ? (
          <>
            <BannerShimmer />
          </>
        ) : isError ? (
          <div>Error: {error?.message}</div>
        ) : (
          <>
            <Swiper
              spaceBetween={30}
              effect={"fade"}
              lazy={true}
              centeredSlides={true}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              modules={[Autoplay, EffectFade, Navigation]}
              className="mySwiper"
              onSwiper={(swiper) => (firstbannerRef.current = swiper)}
            >
              <>
                {hero?.map((image, index) => {
                  return (
                    <>
                      <SwiperSlide key={index}>
                        <Link href={image?.link || "#"}>
                          <motion.img
                            className="img-fluid"
                            alt=""
                            src={image?.image}
                            style={{ objectFit: "cover" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                          />
                        </Link>
                      </SwiperSlide>
                    </>
                  );
                })}
              </>
            </Swiper>
            <div className="first_banner_button">
              <motion.button
                onClick={() => firstbannerRef?.current?.slidePrev()}
                className="prev-button-swiper"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MdKeyboardArrowLeft className="swiper-icon" />
              </motion.button>
              <motion.button
                onClick={() => firstbannerRef?.current?.slideNext()}
                className="next-button-swiper"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MdKeyboardArrowRight className="swiper-icon" />
              </motion.button>
            </div>
          </>
        )}
      </section>

      {/* Categories */}
      {category?.length > 0 && (
        <section className="more_categories">
          <div className="container">
            <div className="more_categories_detail">
              <h3>Browse our categories</h3>
              <Link
                href="/categories"
                className="custom-btn btn-16 mb-4"
                style={{ textDecoration: "none" }}
              >
                View All
              </Link>
            </div>
            <div className="second_banner_button">
              <button
                onClick={() => secondbannerRef?.current?.slidePrev()}
                className="prev-button-swiper"
              >
                <MdKeyboardArrowLeft className="swiper-icon" />
              </button>
              <button
                onClick={() => secondbannerRef?.current?.slideNext()}
                className="next-button-swiper"
              >
                <MdKeyboardArrowRight className="swiper-icon" />
              </button>
            </div>
            <div className="more_categories_slide">
              <Swiper
                slidesPerView={2}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                  },
                  992: {
                    slidesPerView: 2,
                    spaceBetween: 50,
                  },
                  1199: {
                    slidesPerView: 4,
                    spaceBetween: 50,
                  },
                }}
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                spaceBetween={50}
                loop={true}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                onSwiper={(swiper) => (secondbannerRef.current = swiper)}
              >
                {category?.length ? (
                  <>
                    {category?.map((data, index) => {
                      return (
                        <SwiperSlide key={index}>
                        <Link
                          href={`/categories/${encodeURIComponent(data.name.toLowerCase().replace(/\s+/g, '-') )}`}
                          className="text-decoration-none"
                          style={{ color: "#000" }}
                        >
                            <div className="category_box animate__animated animate__fadeInLeft animate__delay-2s">
                              <img
                                src={data.image}
                                className="w-100"
                                alt="item_category"
                              />
                              <div className="category_name">{data.name}</div>
                            </div>
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      {/* Second Banner */}
      <section className="discover_banner">
        <div className="container">
          <div className="banner_info">
            <div className="banner_info_inr">
              <div className="banner_detail text-center">
                <div className="info_img">
                  <Link href={middle_banners[0]?.link || "#"}>
                    <img src='./assets/images/ring.png' width="100px" alt="" />
                  </Link>
                </div>
                {middle_banners[0] ? (
                  <>
                    <Link
                      href={middle_banners[0]?.link || "#"}
                      style={{ textDecoration: "none", color: "#000" }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: bannerSlider?.middle_banners[0]?.description,
                        }}
                      />
                    </Link>
                  </>
                ) : (
                  <>
                    <h2>Exquisite Jewelry for Everyone</h2>
                    <label></label>
                    <p>Discover our awesome rings collection</p>
                    <button className="btn discover_btn">
                      Discover The Collection
                    </button>
                  </>
                )}

                {tags && tags?.length > 0 && middle_banners[0] && (
                  <Link
                    href={middle_banners[0]?.link || "#"}
                    className="btn discover_btn"
                  >
                    Discover The Collection
                  </Link>
                )}
              </div>
            </div>
            <div className="banner_img">
              {middle_banners[0] ? (
                <Link
                  href={middle_banners[0]?.link || "#"}
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src={bannerSlider?.middle_banners[0]?.image}
                    className="w-100"
                    alt=""
                  />
                </Link>
              ) : (
                <Link href={middle_banners[0]?.link || "#"}>
                  <img src='./assets/images/banners/banner_1.jpg' className="w-100" alt="" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newAdd?.length > 0 && (
        <section className="new_arrivals">
          <div className="container">
            <div className="new_arrival_detail">
              <h3>New Arrivals</h3>
            </div>
            <Link
              href="/latest-designs"
              className="custom-btn btn-16 mb-4"
              style={{ textDecoration: "none" }}
            >
              View All
            </Link>
            <div className="second_banner_button">
              <button
                onClick={() => thirdbannerRef?.current?.slidePrev()}
                className="prev-button-swiper"
              >
                <MdKeyboardArrowLeft className="swiper-icon" />
              </button>
              <button
                onClick={() => thirdbannerRef?.current?.slideNext()}
                className="next-button-swiper"
              >
                <MdKeyboardArrowRight className="swiper-icon" />
              </button>
            </div>
            <div className="new_arrival_slide">
              <Swiper
                slidesPerView={2}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                  },
                  992: {
                    slidesPerView: 2,
                    spaceBetween: 50,
                  },
                  1199: {
                    slidesPerView: 4,
                    spaceBetween: 50,
                  },
                }}
                modules={[Pagination, Navigation, Scrollbar, A11y, Autoplay]}
                spaceBetween={20}
                loop={true}
                onSwiper={(swiper) => (thirdbannerRef.current = swiper)}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
              >
                {newAdd?.length ? (
                  <>
                    {newAdd?.slice(0, 50).map((data, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <Link
                            href={`/shopdetails/${encodeURIComponent(data.name.toLowerCase().replace(/\s+/g, '-') )}/${data?.code}`}
                            className="text-decoration-none"
                            style={{ color: "#000" }}
                          >
                            <div className="profile-pic">
                              <div className="profile_img">
                                <img src={data.image} alt="" />
                              </div>

                              <div className="product_details">
                                <h4>{data.name}</h4>
                              </div>
                            </div>
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      {/* Third Banner */}
      <section className="explore_banner">
        <div className="container">
          <div className="banner_info">
            <div className="banner_img">
              {bottom_banners[0] ? (
                <Link href={bottom_banners[0]?.link || "#"}>
                  <img src={bottom_banners[0]?.image} alt="" />
                </Link>
              ) : (
                <Link href={bottom_banners[0]?.link || "#"}>
                  <img src='./assets/images/kada.png' className="w-100" alt="" />
                </Link>
              )}
            </div>
            <div className="banner_info_inr">
              <div className="banner_detail text-center">
                {bottom_banners[0] ? (
                  <>
                    <Link
                      href={bottom_banners[0]?.link || "#"}
                      style={{ textDecoration: "none", color: "#000" }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: bannerSlider?.bottom_banners[0]?.description,
                        }}
                      />
                    </Link>
                  </>
                ) : (
                  <>
                    <h2>Exquisite Jewelry for Everyone</h2>
                    <label></label>
                    <p>Discover our awesome rings collection</p>
                    <div className="info_img_1">
                      <img src='./assets/images/gold_ring.png' width="150px" alt="" />
                    </div>
                    <button className="btn discover_btn">
                      Discover The Collection
                    </button>
                  </>
                )}

                {tags && tags?.length > 0 && bottom_banners[0] && (
                  <Link
                    href={bottom_banners[0]?.link || "#"}
                    className="btn discover_btn"
                  >
                    Discover The Collection
                  </Link>
                )}

                <div className="info_img">
                  <Link href={bottom_banners[0]?.link || "#"}>
                    <img src='./assets/images/ring.png' width="100px" alt="" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top_Sellers */}
      {topSell?.length > 0 && (
        <section className="Top_sellers">
          <div className="container">
            <div className="seller_header">
              <h3>Top sellers</h3>
            </div>
            <Link
              href="/top-selling-designs"
              className="custom-btn btn-16 mb-4"
              style={{ textDecoration: "none" }}
            >
              View All
            </Link>
            <div className="second_banner_button">
              <button
                onClick={() => fourthbannerRef?.current?.slidePrev()}
                className="prev-button-swiper"
              >
                <MdKeyboardArrowLeft className="swiper-icon" />
              </button>
              <button
                onClick={() => fourthbannerRef?.current?.slideNext()}
                className="next-button-swiper"
              >
                <MdKeyboardArrowRight className="swiper-icon" />
              </button>
            </div>
            <div className="seller_slider">
              <Swiper
                slidesPerView={2}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                  },
                  992: {
                    slidesPerView: 3,
                    spaceBetween: 50,
                  },
                  1199: {
                    slidesPerView: 4,
                    spaceBetween: 50,
                  },
                }}
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                spaceBetween={10}
                loop={true}
                onSwiper={(swiper) => (fourthbannerRef.current = swiper)}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
              >
                {topSell?.length ? (
                  <>
                    {topSell?.slice(0, 50).map((data, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <Link
                            href={`/shopdetails/${data.id}`}
                            className="text-decoration-none"
                            style={{ color: "#000" }}
                          >
                            <div className="profile-pic">
                              <img src={data.image} alt="" />
                              <div className="product_details">
                                <h4>{data.name}</h4>
                              </div>
                            </div>
                          </Link>
                        </SwiperSlide>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      {/* testimonials */}
      {review?.length > 0 && (
        <section className="testimonial">
          <div className="container">
            <div className="testimonial_header">
              <img
                src="https://websitedemos.net/jewellery-store-04/wp-content/uploads/sites/935/2021/08/quotation-mark.png"
                alt=""
                className="w-100"
              />
              <h3>TESTIMONIALS</h3>
            </div>
            <div className="second_banner_button">
              <button
                onClick={() => fifthbannerRef?.current?.slidePrev()}
                className="prev-button-swiper"
              >
                <MdKeyboardArrowLeft className="swiper-icon" />
              </button>
              <button
                onClick={() => fifthbannerRef?.current?.slideNext()}
                className="next-button-swiper"
              >
                <MdKeyboardArrowRight className="swiper-icon" />
              </button>
            </div>
            <div className="testimonial_slide">
              <Swiper
                modules={[Pagination, Scrollbar, A11y, Autoplay, Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                loop={true}
                onSwiper={(swiper) => (fifthbannerRef.current = swiper)}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
              >
                <>
                  {review?.map((data, index) => (
                    <SwiperSlide key={index}>
                      <div className="testimonial_details">
                        <span>
                          <b>{data?.customer}</b>
                        </span>
                        <p>
                          <q>{data?.messsage}</q>
                        </p>
                        <img
                          className="testimonial-image"
                          src={data?.image}
                          alt=""
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </>
              </Swiper>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
