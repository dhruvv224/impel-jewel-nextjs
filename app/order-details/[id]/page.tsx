"use client";

import React, { useEffect, useState } from "react";
// Use Next.js Link for navigation
import Link from "next/link"; 
// Use Next.js hooks for routing
import { useParams } from "next/navigation"; 
// Removed: import { Helmet } from "react-helmet-async";
// Removed: import { useParams } from "react-router-dom"; // Old hook
import BreadCrumb from "../../components/common/BreadCrumb"; // Assuming path is correct
import Userservice from "../../services/Cart"; // Assuming path is correct
import Loader from "../../components/common/Loader";
import {
  FaBox,
  FaCheck,
  FaChevronLeft,
  FaRegUser,
  FaTruck,
} from "react-icons/fa";
// import "./OrderTrack.css"; // Assuming this CSS file exists and is imported

// Helper component for tracking status icons (based on your original logic)
const OrderStatusIcon = ({ status }) => {
  switch (status) {
    case "pending":
      return <span className="badge bg-warning">Pending</span>;
    case "accepted":
      return <span className="badge bg-info">Accepted</span>;
    case "processing":
      return <span className="badge bg-primary">Processing</span>;
    case "completed":
      return <span className="badge bg-success">Completed</span>;
    default:
      return <span className="badge bg-secondary">{status}</span>;
  }
};

const Orders = () => {
  // Access the dynamic route segment 'id' from the URL
  const params = useParams(); 
  const orderId = params.id; // Assuming the route is /orders/[id]

  // States to hold localStorage values safely
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);

  const [Items, setItems] = useState(null);
  const [status, setStatus] = useState(null);
  const [product, setProduct] = useState([]);
  const [trackStatus, setTrackStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch localStorage data client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("user_id"));
      setUserType(localStorage.getItem("user_type"));
    }
  }, []);

  const GetUserOrders = async (id, uId, uType) => {
    if (!id || !uId || !uType) {
        setIsLoading(false);
        return;
    }
    
    Userservice.Orderdetails({
      order_id: id,
      user_id: uId,
      user_type: uType,
    })
      .then((res) => {
        setItems(res?.data);
        setProduct(res.data?.order_items || []);
        setStatus(res?.status); // Boolean status from response

        if (res?.status === true && res?.data?.docate_number) {
          const docketNumber = res.data.docate_number;

          // Nested call for Delivery Track
          Userservice.DeliveryTrack({
            docket: docketNumber,
          })
            .then((trackRes) => {
              if (trackRes.status === true) {
                setTrackStatus(trackRes?.data || []);
              }
            })
            .catch((err) => {
              console.error("Error fetching delivery track:", err);
            })
            .finally(() => {
                setIsLoading(false); // Only set loading to false after both API calls attempt to finish
            });
        } else {
            setIsLoading(false); // Set loading to false if primary order fetch finishes without tracking info
        }
      })
      .catch((err) => {
        console.error("Error fetching user orders:", err);
        setIsLoading(false);
        setStatus(false); // Assume status false on failure
      });
  };

  // 2. Fetch data when Order ID and localStorage values are available
  useEffect(() => {
    if (orderId && userId !== null && userType !== null) {
      GetUserOrders(orderId, userId, userType);
    }
    // Note: useLayoutEffect is generally discouraged for data fetching; useEffect is preferred.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, userId, userType]); 

  // Check if Items is null or empty to trigger the "Not Found" message later
  const isOrderFound = status === true && Items !== null;


  return (
    <>
      {/* Next.js client-side equivalent for setting the page title */}
      <title>Impel Store - Order Details</title>
      
      <section className="my-orders">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="container">
            {!isOrderFound ? ( // Use !isOrderFound for error/not found state
              <div className="row justify-content-center text-center">
                <div className="col-md-12">
                  <div className="order-error-section pt-5">
                    <div className="page">
                      Ooops!!! The Order you are looking for is not found
                    </div>
                    {/* Use Next.js Link component */}
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
                        secondUrl="/my-orders"
                        thirdName="Order Details"
                      />
                    </div>
                    {/* Order Information Card */}
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
                                <td>#{Items?.order_id}</td>
                              </tr>
                              <tr>
                                <th scope="col">Order Status :</th>
                                <td>
                                  <OrderStatusIcon status={Items?.order_status} />
                                </td>
                              </tr>
                              <tr>
                                <th scope="col">Order Date :</th>
                                <td>{Items?.order_date}</td>
                              </tr>
                              <tr>
                                <th scope="col">Order Time :</th>
                                <td>{Items?.order_time}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    {/* Customer Information Card */}
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
                                <td>{Items?.customer}</td>
                              </tr>
                              <tr>
                                <th scope="col">Email :</th>
                                <td>{Items?.customer_email}</td>
                              </tr>
                              <tr>
                                <th scope="col">Phone :</th>
                                <td>
                                  {Items?.customer_phone?.replace("+91", "")}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    {/* Shipping Information Card */}
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
                                <td>{Items?.address}</td>
                              </tr>
                              <tr>
                                <th scope="col">City :</th>
                                <td>{Items?.city}</td>
                              </tr>
                              <tr>
                                <th scope="col">State :</th>
                                <td>{Items?.state}</td>
                              </tr>
                              <tr>
                                <th scope="col">Pin-Code :</th>
                                <td>{Items?.pincode}</td>
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
                                  <th>Image</th>
                                  <th>Name</th>
                                  <th>Code</th>
                                  <th>Quantity</th>
                                  <th>Gold Type</th>
                                  <th>Gold Color</th>
                                  <th>Net Weight</th>
                                </tr>
                              </thead>
                              <tbody className="text-center">
                                {product?.map((datas) => (
                                  <tr key={datas?.design_id || datas?.design_code}>
                                    <td>
                                      {/* Use Next.js Link component */}
                                      <Link
                                        href={`/shopdetails/${datas?.design_id}`}
                                        className="nav-link"
                                        style={{ display: 'inline-block' }}
                                      >
                                        <img // Kept <img> as replacing with Next/Image requires static imports or host config
                                          src={datas?.design_image}
                                          alt={datas?.design_name}
                                          style={{ width: "100px" }}
                                        />
                                      </Link>
                                    </td>
                                    <td>
                                      {/* Use Next.js Link component */}
                                      <Link
                                        href={`/shopdetails/${datas?.design_id}`}
                                        className="nav-link"
                                      >
                                        <span>{datas?.design_name}</span>
                                      </Link>
                                    </td>
                                    <td>
                                      <span>
                                        <strong>
                                          {datas?.design_code}
                                        </strong>
                                      </span>
                                    </td>
                                    <td>
                                      <span>{datas?.quantity}</span>
                                    </td>
                                    <td>
                                      <span>{datas?.gold_type}</span>
                                    </td>
                                    <td>
                                      <span>{datas?.gold_color}</span>
                                    </td>
                                    <td>
                                      <span>
                                        {" "}
                                        {datas?.net_weight} g. (Approx.)
                                      </span>
                                    </td>
                                  </tr>
                                ))}
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
        )}
      </section>
    </>
  );
};

export default Orders;