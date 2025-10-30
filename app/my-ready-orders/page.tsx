"use client"; // 👈 Mark as a Client Component

import React, { useEffect, useState } from "react";
// Import Next.js specific components and hooks
import { useRouter } from "next/navigation";
// Removed: import { Helmet } from "react-helmet-async";
// Removed: import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
// Import React Bootstrap components for client side
import { OverlayTrigger, Pagination, Tooltip } from "react-bootstrap"; 
import Loader from "../components/common/Loader";
import axios from "axios";

// Access Next.js public environment variable (must be prefixed with NEXT_PUBLIC_)
// Assuming you have set NEXT_PUBLIC_API_KEY in your .env.local file
const api = process.env.NEXT_PUBLIC_API_KEY;

const MyReadyOrders = () => {
  const router = useRouter(); // 👈 Use Next.js useRouter hook
  
  // Initialize state for client-side data
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  
  const [Items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 1. Client-side access to localStorage to get user data
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("user_id"));
      setUserType(localStorage.getItem("user_type"));
    }
  }, []);

  // Pagination logic remains the same
  const paginate = (array, currentPage, itemsPerPage) => {
    if (!Array.isArray(array)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return array?.slice(startIndex, endIndex);
  };

  const GetAllOrders = async (id, type) => {
    if (!id || !type || !api) {
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    axios
      .post(api + "ready/my-orders", {
        user_id: id,
        user_type: type,
      })
      .then((res) => {
        setItems(res?.data?.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching ready orders:", err);
        setIsLoading(false);
      });
  };

  // 2. Data fetching triggers when user data or currentPage changes
  useEffect(() => {
    // Only call fetch if user data is loaded (i.e., not null)
    if (userId !== null && userType !== null) {
        GetAllOrders(userId, userType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, userType, currentPage]); // Re-fetch when user details load or page changes

  const paginatedItems = paginate(Items, currentPage, itemsPerPage);
  const totalPages = Math.ceil(Items?.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 3. Navigation to detail page using Next.js router
  const handleViewDetails = (orderId) => {
    // Next.js uses query params properly. The original was unconventional: `/ready-order-details/?${orderId}`
    // A clean Next.js path is: /ready-order-details?orderId=12345
    router.push(`/ready-order-details?orderId=${orderId}`);
  };

  const orderDetails = <Tooltip id="tooltip">View order</Tooltip>;
  
  // Use a constant for user_type comparison inside the JSX
  const IS_USER_TYPE_1 = userType === "1"; // userType will be a string from localStorage

  return (
    <>
      {/* Client-side equivalent for setting the page title */}
      <title>Impel Store - My orders</title>
      
      <section className="cart">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div
                    className="card"
                    style={{ border: "none", boxShadow: "2px 2px 2px  #ccc" }}
                  >
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <thead className="table-light text-center">
                            <tr>
                              <th>Order No.</th>
                              <th>Customer</th>
                              <th>Phone No.</th>
                              <th>Dealer</th>
                              <th>Dealer Code</th>
                              {IS_USER_TYPE_1 && <th>Dealer Commission</th>}
                              {IS_USER_TYPE_1 && <th>Commission Status</th>}
                              <th>Order Satus</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody className="text-center">
                            {paginatedItems?.length > 0 ? (
                              <>
                                {paginatedItems.map((datas, index) => {
                                  // Ensure we use a unique, stable key. order_id is a better candidate than index.
                                  const phoneNumber =
                                    datas?.customer_phone?.replace("+91", "");
                                  return (
                                    <tr key={datas?.order_id || index}> 
                                      <td>
                                        <span>{datas?.order_id}</span>
                                      </td>

                                      <td>
                                        <span>{datas?.customer}</span>
                                      </td>

                                      <td>
                                        <span>{phoneNumber}</span>
                                      </td>
                                      <td>
                                        {datas?.dealer ? (
                                          <span>{datas?.dealer}</span>
                                        ) : (
                                          <span>-</span>
                                        )}
                                      </td>
                                      <td>
                                        {datas?.dealer_code ? (
                                          <span>{datas?.dealer_code}</span>
                                        ) : (
                                          <span>-</span>
                                        )}
                                      </td>
                                      {IS_USER_TYPE_1 && (
                                        <td>
                                          <span>
                                            ₹
                                            {Math.round(
                                              datas?.dealer_commission
                                            )}
                                          </span>
                                        </td>
                                      )}

                                      {IS_USER_TYPE_1 && (
                                        <td>
                                          {datas?.commission_status == 1 && (
                                            <span className="badge bg-success">
                                              Paid
                                            </span>
                                          )}
                                          {datas?.commission_status == 0 && (
                                            <span className="badge bg-danger">
                                              Unpaid
                                            </span>
                                          )}
                                        </td>
                                      )}
                                      <td>
                                        {datas?.order_status === "pending" && (
                                          <span className="badge bg-warning">
                                            Pending
                                          </span>
                                        )}
                                        {datas?.order_status ===
                                          "accepted" && (
                                          <span className="badge bg-info">
                                            Accepted
                                          </span>
                                        )}
                                        {datas?.order_status ===
                                          "processing" && (
                                          <span className="badge bg-primary">
                                            Processing
                                          </span>
                                        )}
                                        {datas?.order_status ===
                                          "completed" && (
                                          <span className="badge bg-success">
                                            Completed
                                          </span>
                                        )}
                                      </td>
                                      <td>
                                        <span>
                                          <OverlayTrigger
                                            placement="top"
                                            overlay={orderDetails}
                                          >
                                            <h5
                                              onClick={() =>
                                                handleViewDetails(
                                                  datas?.order_id
                                                )
                                              } // 👈 Use Next.js navigation handler
                                              style={{ cursor: "pointer" }}
                                            >
                                              <FaEye />
                                            </h5>
                                          </OverlayTrigger>
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </>
                            ) : (
                              <>
                                <tr className="text-center">
                                  <td
                                    colSpan={IS_USER_TYPE_1 ? 9 : 7}
                                    className="p-3"
                                  >
                                    <span
                                      className="text-danger"
                                      style={{ fontSize: "26px" }}
                                    >
                                      Records Not Found!
                                    </span>
                                  </td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4 orderlist_pagination">
                <Pagination className="custom-pagination">
                  <Pagination.Prev
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages).keys()].map((page) => (
                    <Pagination.Item
                      key={page}
                      active={page + 1 === currentPage}
                      onClick={() => handlePageChange(page + 1)}
                      className="custom-pagination-item"
                    >
                      {page + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default MyReadyOrders;