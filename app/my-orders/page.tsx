'use client'; 

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation"; 
import { FaEye } from "react-icons/fa";
import Userservice from "../services/Cart"; // Assuming correct path
import Head from "next/head"; 
import { OverlayTrigger, Pagination, Tooltip } from "react-bootstrap";
import Loader from "../components/common/Loader";

const MyOrders = () => {
  const router = useRouter(); 

  // 1. Initialize user data states to null/default
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isClientLoaded, setIsClientLoaded] = useState(false); // Flag for client mount

  const [Items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 2. Client-side retrieval of localStorage (Runs only on mount)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("user_id"));
      setUserType(localStorage.getItem("user_type"));
      setIsClientLoaded(true); // Mark client environment as loaded
    }
  }, []);

  // Pagination function remains the same
  const paginate = (array, currentPage, itemsPerPage) => {
    if (!Array.isArray(array)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return array?.slice(startIndex, endIndex);
  };

  // 3. Define the data fetching function
  const GetAllOrders = useCallback(async (id, type) => {
    // Only fetch if user data is valid
    if (!id || !type) {
        // If IDs are null (e.g., initial state or unauthenticated user), stop loading quickly.
        setIsLoading(false);
        return; 
    }
    
    setIsLoading(true);
    Userservice.UserOrders({ user_type: type, user_id: id })
      .then((res) => {
        setItems(res.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setItems([]);
        setIsLoading(false);
      });
  }, []); // Empty dependency array means this function only changes if its definition changes

  // 4. Trigger the API call once client is loaded and user data is available/resolved
  useEffect(() => {
    if (isClientLoaded) {
      // Pass the state values which are now guaranteed to be resolved (null or string)
      GetAllOrders(userId, userType);
    }
    // Re-run API call when the current page changes OR userId/userType changes (after client load)
  }, [currentPage, userId, userType, isClientLoaded, GetAllOrders]); 

  // --- Derived State ---
  const paginatedItems = paginate(Items, currentPage, itemsPerPage);
  const totalPages = Math.ceil(Items.length / itemsPerPage);
  const isUserType1 = userType === "1"; // Compare against string "1" from localStorage

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function for Next.js navigation
  const handleViewOrder = (orderId) => {
    // Navigate to dynamic route segment
    router.push(`/order-details/${orderId}`);
  };

  const orderDetails = <Tooltip id="tooltip">View order</Tooltip>;

  // --- Render ---

  // Show Loader immediately if client data hasn't finished resolving/fetching hasn't started
  if (isLoading || !isClientLoaded) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Impel Store - My orders</title>
      </Head>
      <section className="cart">
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
                          {isUserType1 && <th>Dealer Commission</th>}
                          {isUserType1 && <th>Commission Status</th>}
                          <th>Order Satus</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {paginatedItems?.length > 0 ? (
                          <>
                            {paginatedItems.map((datas, index) => {
                              const phoneNumber = datas?.customer_phone?.replace("+91", "");
                              return (
                                // Use a better key if available (e.g., datas?.order_id)
                                <tr key={datas?.order_id || index}> 
                                  <td><span>{datas?.order_id}</span></td>
                                  <td><span>{datas?.customer}</span></td>
                                  <td><span>{phoneNumber}</span></td>
                                  <td>{datas?.dealer ? (<span>{datas?.dealer}</span>) : (<span>-</span>)}</td>
                                  <td>{datas?.dealer_code ? (<span>{datas?.dealer_code}</span>) : (<span>-</span>)}</td>
                                  
                                  {isUserType1 && (
                                    <td>
                                      <span>₹{Math.round(datas?.dealer_commission)}</span>
                                    </td>
                                  )}

                                  {isUserType1 && (
                                    <td>
                                      {datas?.commission_status == 1 ? (
                                        <span className="badge bg-success">Paid</span>
                                      ) : (
                                        <span className="badge bg-danger">Unpaid</span>
                                      )}
                                    </td>
                                  )}

                                  <td>
                                    {datas?.order_status === "pending" && (<span className="badge bg-warning">Pending</span>)}
                                    {datas?.order_status === "accepted" && (<span className="badge bg-info">Accepted</span>)}
                                    {datas?.order_status === "processing" && (<span className="badge bg-primary">Processing</span>)}
                                    {datas?.order_status === "completed" && (<span className="badge bg-success">Completed</span>)}
                                  </td>
                                  <td>
                                    <span>
                                      <OverlayTrigger placement="top" overlay={orderDetails}>
                                        <h5
                                          onClick={() => handleViewOrder(datas?.order_id)}
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
                          <tr className="text-center">
                            <td colSpan={isUserType1 ? 9 : 7} className="p-3">
                              <span className="text-danger" style={{ fontSize: "26px" }}>
                                Records Not Found!
                              </span>
                            </td>
                          </tr>
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
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        )}
      </section>
    </>
  );
};

export default MyOrders;