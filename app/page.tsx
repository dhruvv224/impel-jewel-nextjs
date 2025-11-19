"use client"
import React, { useRef, useState, useEffect } from "react";
// Replaced React Router Link with Next.js Link
import Link from "next/link"; 
import dynamic from "next/dynamic"; // For client-side logic
// Note: Next.js pages in 'pages' directory don't need a wrapper Helmet/Head 
// unless you want dynamic metadata, which is generally done at the layout level
// or via getServerSideProps/getStaticProps. This component doesn't use Helmet.
import './globals.css';
import { Swiper, SwiperSlide } from "swiper/react";
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

// Swiper CSS imports are fine as global imports in Next.js
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "./globals.css";

// Local asset imports are fine, Next.js handles them
// Assuming WomansClub is a regular component, if it contains browser APIs, 
// it might need dynamic import too, but for now, we assume it's safe.
import WomansClub from "./components/common/WomansClub"; 

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import BannerShimmer from "./shimmer/BannerShimmer";

const Home = () => {
  // Utility to extract only text from HTML (Safe to run in SSR)
  function extractTextFromHTML(html) {
    if (typeof document === 'undefined' || !html) return '';
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
  const [popupTimer, setPopupTimer] = useState(0);
  
  // Removed videoEl logic as it requires complex SSR handling 
  // and wasn't fully implemented (attemptPlay was empty).
  
  // Fetch Banners Query
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

  const bannerSlider = data?.data || {};
  const hero = Array.isArray(data?.data?.top_banners)
    ? data?.data?.top_banners
    : [];
  const middle_banners = Array.isArray(data?.data?.middle_banners)
    ? data?.data?.middle_banners
    : [];
  const bottom_banners = Array.isArray(data?.data?.bottom_banners)
    ? data?.data?.bottom_banners
    : [];

  // Fetch Tags Query
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => FilterServices.headerTags(),
    select: (data) => data?.data || [],
  });

  // Fetch Category Query
  const { data: category } = useQuery({
    queryKey: ["category"],
    queryFn: () => homeService.category(),
    select: (data) => data?.data || [],
  });
  
  // Fetch New Arrivals Query
  const { data: newAdd } = useQuery({
    queryKey: ["recentAdd"],
    queryFn: () => homeService.RecentAdd(),
    select: (data) => data?.data || [],
  });

  // Fetch Testimonials Query
  const { data: review } = useQuery({
    queryKey: ["TestiMonials"],
    queryFn: () => homeService.TestiMonials(),
    select: (data) => data?.data || [],
  });

  // Fetch Top Selling Query
  const { data: topSell } = useQuery({
    queryKey: ["TopSelling"],
    queryFn: () => homeService.TopSelling(),
    select: (data) => data?.data || [],
  });

  // Fetch Pop-up Data Query
  const { data: popupData } = useQuery({
    queryKey: ["popupData"], // Needs a unique query key
    queryFn: () => homeService.GetPopUpData(),
    select: (data) => data?.data ,
  });
  
  // Corrected console.log to show the actual object data
  // console.log(popupData,":::") // Removed for production code
  
  // Set popup timer from fetched data
  useEffect(() => {
    if (popupData?.[0]?.duration) {
      setPopupTimer(popupData[0].timer);
    }
  }, [popupData])

  // console.log(popupData,":::") // Removed for production code

  // Set popup timer from fetched data
 

  // Handle popup timer to show the popup (Client-side only logic)
  useEffect(() => {
    let timer;
    if (typeof window !== 'undefined' ) {
      timer = setTimeout(() => {
        setShowPopup(true);
      }, popupTimer);
    }
    return () => {
      if(timer) clearTimeout(timer);
    };
  }, [popupTimer]);

  // Control body scroll when popup is open (Client-side only logic)
  useEffect(() => {
    if (typeof window !== 'undefined') {
        if (showPopup) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    };
  }, [showPopup]);

  return (
    <>
      {/* Popup Section - Client-side interaction logic */}
      {showPopup && popupData?.[0] && (
        <div
          onClick={(e) => {
            // Check window only once to avoid unnecessary checks inside event handler
            if (typeof window !== 'undefined' && e.target === e.currentTarget) {
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
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.5s",
            backdropFilter: "blur(4px)",
            cursor: "pointer",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#f0e1cc",
              borderRadius: "24px",
              boxShadow: "0 16px 64px rgba(0,0,0,0.3)",
              padding: "48px 48px 36px 48px",
              maxWidth: "1100px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "scroll", // Changed to 'scroll' for Next.js friendly style object
              textAlign: "center",
              position: "relative",
              border: "1px solid #e0e0e0",
            }}
          >
            {/* Close Button */}
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
                background: "transparent",
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
                    borderRadius: "12px",
                    marginBottom: "36px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                    border: "4px solid #bfa76f",
                  }}
                />
              )}
              <h2
                style={{
                  marginBottom: "16px",
                  color: "#333",
                  fontWeight: 700,
                  fontSize: "2.2rem",
                  letterSpacing: "-0.5px",
                }}
              >
                {popupData[0]?.title}
              </h2>
              <div
                style={{
                  color: "#666",
                  fontSize: "18px",
                  lineHeight: "1.6",
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
                  if (typeof window !== 'undefined' && popupData[0]?.btn_url) {
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

      <WomansClub />
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
                    <SwiperSlide key={index}>
                      {/* Replaced <Link to={...}> with <Link href={...}> */}
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
                  );
                })}
              </>
            </Swiper>
            <div className="first_banner_button">
              {/* Added conditional check for current ref state is ready for client-side Swiper control */}
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
                      // Construct the URL path for Next.js Link
                      const categorySlug = encodeURIComponent(
                        data.name.toLowerCase().replace(/\s+/g, "-")
                      );
                      const linkPath = `/categories/${categorySlug}`;
                      
                      return (
                        <SwiperSlide key={index}>
                          {/* Replaced <Link to={...} state={...}> with <Link href={...} query={...}> */}
                          <Link
                            href={{
                              pathname: linkPath,
                              query: { id: data.id, name: data.name },
                            }}
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
            {/* Replaced <Link to={...}> with <Link href={...}> */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Link
                href="/categories"
                className="custom-btn btn-16 mb-4"
                style={{ textDecoration: "none" }}
              >
                View All
              </Link>
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
                  {/* Replaced <Link to={...}> with <Link href={...}> */}
                  <Link href={middle_banners[0]?.link || "#"}>
                    <img src='/assets/images/ring.png' width="100px" alt="" />
                  </Link>
                </div>
                {middle_banners[0] ? (
                  <>
                    {/* Replaced <Link to={...}> with <Link href={...}> */}
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
                  // Replaced <Link to={...}> with <Link href={...}>
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
                // Replaced <Link to={...}> with <Link href={...}>
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
                // Replaced <Link to={...}> with <Link href={...}>
                <Link href={middle_banners[0]?.link || "#"}>
                  <img src='/assets/images/bg-01.jpeg' className="w-100" alt="" />
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
                      // Construct the URL path for Next.js Link
                      const productSlug = encodeURIComponent(
                        data.name.toLowerCase().replace(/\s+/g, "-")
                      );
                      const linkPath = `/shopdetails/${productSlug}/${data?.code}`;

                      return (
                        <SwiperSlide key={index}>
                          {/* Replaced <Link to={...} state={...}> with <Link href={...}> */}
                          <Link
                            href={linkPath}
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
            {/* Replaced <Link to={...}> with <Link href={...}> */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Link
                href="/latest-designs"
                className="custom-btn btn-16 mb-4"
                style={{ textDecoration: "none" }}
              >
                View All
              </Link>
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
                // Replaced <Link to={...}> with <Link href={...}>
                <Link href={bottom_banners[0]?.link || "#"}>
                  <img src={bottom_banners[0]?.image} alt="" />
                </Link>
              ) : (
                // Replaced <Link to={...}> with <Link href={...}>
                <Link href={bottom_banners[0]?.link || "#"}>
                  <img src='/assets/images/kada.jpg' className="w-100" alt="" />
                </Link>
              )}
            </div>
            <div className="banner_info_inr">
              <div className="banner_detail text-center">
                {bottom_banners[0] ? (
                  <>
                    {/* Replaced <Link to={...}> with <Link href={...}> */}
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
                      <img src='/assets/images/gold_ring.png' width="150px" alt="" />
                    </div>
                    <button className="btn discover_btn">
                      Discover The Collection
                    </button>
                  </>
                )}

                {tags && tags?.length > 0 && bottom_banners[0] && (
                  // Replaced <Link to={...}> with <Link href={...}>
                  <Link
                    href={bottom_banners[0]?.link || "#"}
                    className="btn discover_btn"
                  >
                    Discover The Collection
                  </Link>
                )}

                <div className="info_img">
                  {/* Replaced <Link to={...}> with <Link href={...}> */}
                  <Link href={bottom_banners[0]?.link || "#"}>
                    <img src='/assets/images/ring.png' width="100px" alt="" />
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
                          {/* Replaced <Link to={...}> with <Link href={...}> */}
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
            {/* Replaced <Link to={...}> with <Link href={...}> */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Link
                href="/top-selling-designs"
                className="custom-btn btn-16 mb-4"
                style={{ textDecoration: "none" }}
              >
                View All
              </Link>
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