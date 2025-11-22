'use client'; // 👈 Mark as a Client Component

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // 👈 Use Next.js hook for query params
// Removed: import { Link, useLocation, useParams } from "react-router-dom";
// Removed: import { Helmet } from "react-helmet-async";

import BreadCrumb from "../components/common/BreadCrumb"; // Assuming path is correct
import Loader from "../components/common/Loader";
import axios from "axios";
import profileService from "../services/Home"; // Assuming path is correct
import Userservice from "../services/Cart"; // Assuming path is correct
// Removed: import noImage from "../../assets/images/No_Image_Available.jpg";

// Access Next.js public environment variable
const api = process.env.NEXT_PUBLIC_API_KEY;
const NO_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";

const ReadyOrderDetailsInner = () => {
  const searchParams = useSearchParams();

  
  // Get order ID from query parameter (e.g., /ready-order-details?order_id=12345)
  // Try multiple possible parameter names
  const dynamicId = searchParams.get('order_id') || 
                    searchParams.get('orderId') || 
                    searchParams.get('id') ||
                    (searchParams.toString().includes('=') 
                      ? searchParams.toString().split('=')[1] 
                      : searchParams.toString()); 

  // Local Storage states
  const [user_id, setUserId] = useState(null);
  const [user_type, setUserType] = useState(null);

  const [Items, setItems] = useState(null);
  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allPrices, setAllPrices] = useState(null);
  const [trackStatus, setTrackStatus] = useState(null);

  // Status state to check if the overall order details API call succeeded or failed
  // Using a distinct success/failure flag instead of re-using order_status string
  const [orderApiSuccess, setOrderApiSuccess] = useState(false); 

  // 1. Fetch localStorage data client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("user_id"));
      setUserType(localStorage.getItem("user_type"));
    }
  }, []);

  const GetUserOrders = async (orderId, uId, uType) => {
    if (!orderId || !uId || !uType || !api) {
        setIsLoading(false);
        return;
    }
    
    axios
      .post(api + "ready/order-details", {
        order_id: orderId,
        user_id: uId,
        user_type: uType,
      })
      .then((res) => {
        const orderData = res?.data?.data;
        const status = res?.data?.status;

        if (status === true && orderData) {
          setOrderApiSuccess(true);
          setItems(orderData);
          setProduct(orderData.order_items || []);

          if (orderData.docate_number) {
            // Nested call for Delivery Track
            Userservice.DeliveryTrack({
              docket: orderData.docate_number,
            })
              .then((trackRes) => {
                // Note: API returns "true" string
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
        } else {
          setOrderApiSuccess(false);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching ready order details:", err);
        setOrderApiSuccess(false);
        setIsLoading(false);
      });
  };

  // 2. Fetch data when order ID and user data are available
  useEffect(() => {
    if (dynamicId && user_id !== null && user_type !== null) {
        GetUserOrders(dynamicId, user_id, user_type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamicId, user_id, user_type]);

  // 3. Fetch Product Prices
  useEffect(() => {
    profileService
      .GetProductsPrices()
      .then((res) => {
        setAllPrices(res?.data);
      })
      .catch((err) => {
        console.error("Error fetching product prices:", err);
      });
  }, []); // Run once on client mount

  // Price array logic (retained original structure)
  // Note: This logic seems redundant and likely only accesses the first element.
  var finalPrice = [
    { price_24k: allPrices?.price_24k },
    { sales_wastage: allPrices?.sales_wastage_rtd },
    { sales_wastage_discount: allPrices?.sales_wastage_discount_rtd },
    { show_estimate: allPrices?.show_estimate },
  ];
  const finalPricesMap = finalPrice[3]?.show_estimate || {}; // Map for easy access

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN")?.format(Math?.round(value));

  let tracking_status = "";

  if (trackStatus?.shipment_status === "SCREATED") {
    tracking_status = "Shipment Created";
  } else if (trackStatus?.shipment_status === "SCHECKIN") {
    tracking_status = "If the shipment picked up by sequel staff";
  } else if (trackStatus?.shipment_status === "SLINREC") {
    tracking_status = "If the shipment is at the hub and checked into the hub is at the hub";
  } else if (trackStatus?.shipment_status === "SLINORIN") {
    tracking_status = "Shipment Departed from Origin Hub";
  } else if (trackStatus?.shipment_status === "SLINDEST") {
    tracking_status = "Shipment Arrived at destination hub";
  } else if (trackStatus?.shipment_status === "SDELASN") {
    tracking_status = "Shipment out for delivery";
  } else if (trackStatus?.shipment_status === "SDELVD") {
    tracking_status = "Shipment is delivered";
  } else if (trackStatus?.shipment_status === "SCANCELLED") {
    tracking_status = "Shipment is cancelled";
  }

  // Helper component for status badges
  const OrderStatusBadge = ({ status }) => {
    if (!status) return <td>-</td>;
    let className = 'bg-secondary';
    switch (status) {
        case 'pending': className = 'bg-warning'; break;
        case 'accepted': className = 'bg-info'; break;
        case 'processing': className = 'bg-primary'; break;
        case 'completed': className = 'bg-success'; break;
        default: className = 'bg-secondary';
    }
    return (
        <td>
            <span className={`badge ${className}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        </td>
    );
  };
  
  const PaymentStatusBadge = ({ status }) => (
    <td>
        <span className={`badge ${status === 1 ? 'bg-success' : 'bg-danger'}`}>
            {status === 1 ? 'Paid' : 'UnPaid'}
        </span>
    </td>
  );


  return (
    <>
      {/* Client-side equivalent for setting the page title */}
      <title>Impel Store - Ready Order Details</title>
      
      <section className="my-orders">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="container">
              {!orderApiSuccess || !Items ? (
                <div className="row justify-content-center text-center">
                  <div className="col-md-12">
                    <div className="order-error-section pt-5">
                      <div className="page">
                        Ooops!!! The Order you are looking for is not found
                      </div>
                      <Link href="/" className="back-home">
                        Back to home
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Order Details */}
                  <div className="order_details">
                    <div className="row">
                      <div className="col-md-12">
                        <BreadCrumb
                          firstName="Home"
                          firstUrl="/"
                          secondName="My Orders"
                          secondUrl="/my-ready-orders"
                          thirdName="Order Details"
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <div
                          className="card"
                          style={{
                            border: "none",
                            boxShadow: "2px 2px 2px  #ccc",
                            height: "100%",
                          }}
                        >
                          <div className="card-body">
                            <h4 className="header-title">Order Information</h4>
                            <table className="table">
                              <tbody>
                                <tr>
                                  <th scope="col">Order No :</th>
                                  <td>#{Items.order_id}</td>
                                </tr>
                                <tr>
                                  <th scope="col">Order Status :</th>
                                  <OrderStatusBadge status={Items.order_status} />
                                </tr>
                                <tr>
                                  <th scope="col">Order Date :</th>
                                  <td>{Items.order_date}</td>
                                </tr>
                                <tr>
                                  <th scope="col">Order Time :</th>
                                  <td>{Items.order_time}</td>
                                </tr>
                                <tr>
                                  <th scope="col">Payment Method :</th>
                                  <td>{Items.payment_method}</td>
                                </tr>
                                <tr>
                                  <th scope="col">Payment Status :</th>
                                  <PaymentStatusBadge status={Items.payment_status} />
                                </tr>
                                <tr>
                                  <th scope="col">Tracking Status :</th>
                                  <td>{tracking_status || 'N/A'}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div
                          className="card"
                          style={{
                            border: "none",
                            boxShadow: "2px 2px 2px  #ccc",
                            height: "100%",
                          }}
                        >
                          <div className="card-body">
                            <h4 className="header-title">
                              Customer Information
                            </h4>
                            <table className="table">
                              <tbody>
                                <tr>
                                  <th scope="col">Name :</th>
                                  <td>{Items.customer}</td>
                                </tr>
                                <tr>
                                  <th scope="col">Email :</th>
                                  <td>{Items.customer_email}</td>
                                </tr>
                                <tr>
                                  <th scope="col">Phone :</th>
                                  <td>
                                    {Items.customer_phone?.replace("+91", "")}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div
                          className="card"
                          style={{
                            border: "none",
                            boxShadow: "2px 2px 2px  #ccc",
                            height: "100%",
                          }}
                        >
                          <div className="card-body shipping-Information">
                            <h4 className="header-title">
                              Shipping Information
                            </h4>
                            <table className="table">
                              <tbody>
                                <tr>
                                  <th scope="col">Address :</th>
                                  <td>{Items.address}</td>
                                </tr>
                                <tr>
                                  <th scope="col">City :</th>
                                  <td>{Items.city}</td>
                                </tr>
                                <tr>
                                  <th scope="col">State :</th>
                                  <td>{Items.state}</td>
                                </tr>
                                <tr>
                                  <th scope="col">Pin-Code :</th>
                                  <td>{Items.pincode}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Products */}
                  <div className="order_products">
                    <div className="row mb-3">
                      <div className="col-lg-12 col-md-12">
                        <div
                          className="card"
                          style={{
                            border: "none",
                            boxShadow: "2px 2px 2px  #ccc",
                          }}
                        >
                          <div className="card-body">
                            <div className="table-responsive">
                              <table className="table mb-0">
                                <thead className="table-light text-center">
                                  <tr>
                                    <th>IMAGE</th>
                                    <th>NAME</th>
                                    <th>QTY.</th>
                                    <th>NET WEIGHT</th>
                                    <th>METAL VALUE</th>
                                    <th>MAKING CHARGE</th>
                                    <th>TOTAL AMOUNT</th>
                                  </tr>
                                </thead>
                                <tbody className="text-center">
                                  {product?.map((datas) => {
                                    // Check if show_estimate is 1 for this product's sub_item_id
                                    const is_estimate = finalPricesMap[datas.sub_item_id] === 1;

                                    return (
                                      <tr key={datas.barcode || datas.tag_no}>
                                        <td>
                                          <img
                                            src={`https://api.indianjewelcast.com/TagImage/${datas.barcode}.jpg`}
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = NO_IMAGE_URL;
                                            }}
                                            alt={datas.design_name || "Product image"}
                                            style={{ width: "100px" }}
                                          />
                                        </td>
                                        <td>
                                          <span>{datas.design_name}</span>
                                        </td>

                                        <td>
                                          <span>{datas.quantity}</span>
                                        </td>
                                        <td>
                                          <span>{datas.net_weight} g.</span>
                                        </td>

                                        {is_estimate ? (
                                          <td>
                                            <span>
                                              ₹{numberFormat(datas.metal_value)}
                                            </span>
                                          </td>
                                        ) : (
                                          <td>-</td>
                                        )}

                                        {is_estimate ? (
                                          <td>
                                            <span>
                                              ₹
                                              {datas.making_charge_discount > 0
                                                ? numberFormat(datas.making_charge_discount)
                                                : numberFormat(datas.making_charge)}
                                            </span>
                                          </td>
                                        ) : (
                                          <td>-</td>
                                        )}

                                        <td>
                                          <span>
                                            <strong>
                                              ₹{numberFormat(datas.item_total)}
                                            </strong>
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Payments */}
                  <div className="order_payments order_details">
                    <div className="row justify-content-end">
                      <div className="col-lg-4 col-md-4">
                        <div
                          className="card"
                          style={{
                            border: "none",
                            boxShadow: "2px 2px 2px  #ccc",
                          }}
                        >
                          <div className="card-body">
                            <h4 className="header-title">Order Summary</h4>
                            <div className="table-responsive">
                              <table className="table mb-0">
                                <tbody>
                                  <tr>
                                    <th>
                                      <strong>SUB TOTAL :</strong>
                                    </th>
                                    <td>₹{numberFormat(Items.sub_total)}</td>
                                  </tr>
                                  <tr>
                                    <th>
                                      <strong>GST (3%) :</strong>
                                    </th>
                                    <td>₹{numberFormat(Items.gst_amount)}</td>
                                  </tr>
                                  {Items.dealer_code &&
                                    Items.dealer_discount_type &&
                                    Items.dealer_discount_value && (
                                      <tr>
                                        <th>
                                          <strong className="text-success">
                                            Dealer Discount <br />(
                                            {Items.dealer_code}) &nbsp;
                                            <span>
                                              {Items.dealer_discount_type ===
                                              "percentage" ? (
                                                <>
                                                  (-
                                                  {Items.dealer_discount_value}
                                                  %)
                                                </>
                                              ) : (
                                                <></>
                                              )}
                                            </span>
                                          </strong>
                                          &nbsp;:
                                        </th>
                                        <td className="text-success">
                                          <p className="m-0">
                                            {Items.dealer_discount_type ===
                                            "percentage"
                                              ? `- ₹${numberFormat(
                                                  (Items.charges *
                                                    Items.dealer_discount_value) /
                                                    100
                                                )}`
                                              : `- ₹${numberFormat(
                                                  Items.dealer_discount_value
                                                )}`}
                                          </p>
                                        </td>
                                      </tr>
                                    )}

                                  <tr>
                                    <th>TOTAL :</th>
                                    <td className="font-weight-bold">
                                      {/* Using numberFormat for consistent display */}
                                      ₹{numberFormat(Items.total)} 
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
};

const ReadyOrderDetails = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ReadyOrderDetailsInner />
  </Suspense>
);

export default ReadyOrderDetails;