"use client"; // 👈 Mark as a Client Component

import React, { Suspense, useEffect, useState } from "react";
// Import Next.js specific components and hooks
import { useRouter, useSearchParams } from "next/navigation"; 
import Image from "next/image"; // For logo optimization
// Removed: import { Helmet } from "react-helmet-async";
// Removed: import { useLocation, useNavigate } from "react-router-dom";
// import "./OrderTrack.css";
import Userservice from "../services/Cart";
import axios from "axios";
import { FaBox, FaCheck, FaRegUser, FaTruck } from "react-icons/fa";
// Assuming this path is correct for a local image file
import Loader from "../components/common/Loader";

// Access Next.js public environment variable
const api = process.env.NEXT_PUBLIC_API_KEY || 'https://admin.impel.store/api/';

// Define the absolute path for the logo for the Next.js Image component
// Note: If 'assets/images/logo.png' is a local file, Next.js Image component is preferred.

const OrderTracking = () => {
  const router = useRouter(); // 👈 Next.js hook for navigation
  const searchParams = useSearchParams(); // 👈 Next.js hook for query 

  
  // Get the order number from the query parameter (e.g., /order-tracking?order_number=XYZ or ?transaction_id=XYZ)
  const dynamicId =searchParams.get('transaction_id'); 
  console.log(dynamicId,"dynamicId")
  const [Items, setItems] = useState<any>(null); // Changed initial state to null
  const [trackStatus, setTrackStatus] = useState<any>(null); // Changed initial state to null
  const [product, setProduct] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null); // Corrected typo in original code
  const [isLoading, setIsLoading] = useState(true); // Changed initial state to true
  const [itemStatus, setItemStatus] = useState(false);
  const GetUserOrders = async (orderNumber: string | null) => {
    if (!orderNumber) {
        setIsLoading(false);
        return;
    }
    
    axios
      .post(api + "order-track-details", {
        order_number: orderNumber,
      })
      .then((res) => {
        const responseData = res?.data;
        setItems(responseData?.data);
        setProduct(responseData?.data?.order_items || []);
        setMessage(responseData?.message);
        setItemStatus(responseData?.status); // true/false status from API

        if (responseData?.status === true && responseData?.data?.docate_number) {
          const docketNumber = responseData.data.docate_number;

          // Nested call for Delivery Track
          Userservice.DeliveryTrack({
            docket: docketNumber,
          })
            .then((trackRes) => {
              // Note: API returns "true" string, so matching that logic
              if (trackRes.status === "true") {
                setTrackStatus(trackRes?.data);
              }
            })
            .catch((err) => {
              console.error("Error fetching delivery track:", err);
            })
            .finally(() => {
                setIsLoading(false); 
            });
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching order tracking:", err);
        setIsLoading(false);
        setItemStatus(false);
        setMessage("An error occurred while fetching order details.");
      });
  };

  useEffect(() => {
    // Fetch data whenever the order number changes
    GetUserOrders(dynamicId);
    // Note: useLayoutEffect is generally discouraged for data fetching; useEffect is preferred.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamicId]);

  // Determine user-friendly tracking status
  let tracking_status_text = "N/A";
  const shipmentStatus = trackStatus?.shipment_status;

  if (shipmentStatus) {
      if (shipmentStatus === "SCREATED") {
          tracking_status_text = "Order confirmed";
      } else if (shipmentStatus === "SCHECKIN") {
          tracking_status_text = "Picked by courier / At Origin Hub";
      } else if (shipmentStatus === "SLINREC") {
          tracking_status_text = "Arrived at Origin Hub";
      } else if (shipmentStatus === "SLINORIN") {
          tracking_status_text = "Shipment Departed from Origin Hub";
      } else if (shipmentStatus === "SLINDEST") {
          tracking_status_text = "Shipment Arrived at destination hub";
      } else if (shipmentStatus === "SDELASN") {
          tracking_status_text = "Out for delivery";
      } else if (shipmentStatus === "SDELVD") {
          tracking_status_text = "Delivered";
      } else if (shipmentStatus === "SCANCELLED") {
          tracking_status_text = "Shipment is cancelled";
      }
  }


  return (
    <>
      {/* Next.js client-side equivalent for setting the page title */}
      <title>Impel Store - Order Tracking</title>
      
      <section className="login">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="container">
            <div className="">
              <div className="row justify-content-center text-align-center">
                <div className="order-track-section mt-3">
                  <article className="card">
                    <div className="text-center p-3">
                      {/* Using Next.js Image component for the logo */}
                      <Image 
                        src='/assets/images/logo.png' 
                        alt="logo" 
                        style={{ width: "130px", height: "auto" }} 
                        width={130}
                        height={50} // Adjust height to match aspect ratio
                      />
                    </div>

                    {itemStatus === true && Items ? (
                      <>
                        <div className="card-body">
                          <h6>Order ID: #{Items?.order_id}</h6>
                          <article className="card">
                            <div className="card-body row">
                              <div className="col">
                                <strong>Estimated Delivery time:</strong>{" "}
                                <br />
                                {trackStatus?.estimated_delivery || 'N/A'}
                              </div>
                              <div className="col">
                                <strong>Shipping BY:</strong> <br />
                                {trackStatus?.insurance || 'N/A'}
                              </div>
                              <div className="col">
                                <strong>Status:</strong> <br />
                                {tracking_status_text}
                              </div>
                              <div className="col">
                                <strong>Tracking #:</strong> <br />
                                {trackStatus?.docket_no || 'N/A'}
                              </div>
                            </div>
                          </article>

                          <div className="track">
                            {/* Simplified tracking logic using the shipment status */}
                            <div
                              className={`step ${
                                shipmentStatus && ["SCREATED", "SCHECKIN", "SLINREC", "SLINORIN", "SLINDEST", "SDELASN", "SDELVD"].includes(shipmentStatus) ? "active" : ""
                              }`}
                            >
                              <span className="icon">
                                <FaCheck />
                              </span>
                              <span className="text">Order confirmed</span>
                            </div>
                            <div
                              className={`step ${
                                shipmentStatus && ["SCHECKIN", "SLINREC", "SLINORIN", "SLINDEST", "SDELASN", "SDELVD"].includes(shipmentStatus) ? "active" : ""
                              }`}
                            >
                              <span className="icon">
                                <FaRegUser />
                              </span>
                              <span className="text">Picked by courier</span>
                            </div>
                            <div
                              className={`step ${
                                shipmentStatus && ["SDELASN", "SDELVD"].includes(shipmentStatus) ? "active" : ""
                              }`}
                            >
                              <span className="icon">
                                <FaTruck />
                              </span>
                              <span className="text">Out for delivery</span>
                            </div>
                            <div
                              className={`step ${
                                shipmentStatus === "SDELVD" ? "active" : ""
                              }`}
                            >
                              <span className="icon">
                                <FaBox />
                              </span>
                              <span className="text">Delivered</span>
                            </div>
                          </div>

                          <hr />
                          <ul className="row">
                            {product?.map((datas) => (
                              <li key={datas?.design_id} className="col-md-4">
                                <figure className="itemside mb-3">
                                  <div className="aside">
                                    <img // Keeping <img> here, assuming image URL is external
                                      src={datas?.design_image ||'/assets/images/No_Image_Available.jpg'}
                                      className="img-sm border"
                                      alt={datas?.design_name}
                                    />
                                  </div>
                                  <figcaption className="info">
                                    <h6 className="title">
                                      {datas?.design_name}
                                    </h6>
                                  </figcaption>
                                </figure>
                              </li>
                            ))}
                          </ul>
                          <hr />

                          <div className="d-flex justify-content-center align-items-center">
                            <button
                              className="view_all_btn px-4 py-2"
                              style={{ borderRadius: "8px" }}
                              // Use Next.js router for navigation
                              onClick={() => router.push("/")} 
                            >
                              Back to Site
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="card-body">
                          <h4 className="text-center">{message || "Order details not available."}</h4>
                          <div className="d-flex justify-content-center align-items-center mt-4">
                            <button
                              className="view_all_btn px-4 py-2"
                              style={{ borderRadius: "8px" }}
                              // Use Next.js router for navigation
                              onClick={() => router.push("/")}
                            >
                              Back to Site
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </article>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

const ReadyProcessingOrder = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <OrderTracking />
  </Suspense>
);

export default ReadyProcessingOrder;