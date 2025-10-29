'use client'; // ⬅️ REQUIRED: Uses state, useEffect, and client-side navigation.

import React, { useEffect, useState } from "react";
// ✅ Next.js App Router replacement for navigation
import { useRouter } from "next/navigation"; 
import { FaEye } from "react-icons/fa";
import Userservice from "../services/Cart"; // Assuming correct path
// ✅ Next.js Head replacement for metadata
import Head from "next/head"; 
import { OverlayTrigger, Pagination, Tooltip } from "react-bootstrap";
import Loader from "../components/common/Loader";

const MyOrders = () => {
  // ❌ Original: const navigate = useNavigate();
  // ✅ Next.js replacement
  const router = useRouter(); 

  // NOTE: localStorage access is safe here because this is a 'use client' component.
  const user_id = localStorage.getItem("user_id");
  const user_type = localStorage.getItem("user_type");
  
  const [Items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Pagination function remains the same
  const paginate = (array, currentPage, itemsPerPage) => {
    if (!Array.isArray(array)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return array?.slice(startIndex, endIndex);
  };

  const GetAllOrders = async () => {
    // Only fetch if user_id and user_type are available
    if (!user_id || !user_type) {
        setIsLoading(false);
        return; 
    }
    
    Userservice.UserOrders({ user_type: user_type, user_id: user_id })
      .then((res) => {
        setItems(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // Re-run API call when the current page changes
    GetAllOrders();
  }, [currentPage]); 

  const paginatedItems = paginate(Items, currentPage, itemsPerPage);
  const totalPages = Math.ceil(Items.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function for Next.js navigation
  const handleViewOrder = (orderId) => {
    // ✅ Next.js programmatic navigation
    router.push(`/order-details/${orderId}`);
  };

  const orderDetails = <Tooltip id="tooltip">View order</Tooltip>;

  return (
    <>
      {/* ✅ Replaced Helmet with Next.js Head component */}
      <Head>
        <title>Impel Store - My orders</title>
      </Head>
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
                              {user_type == 1 ? <th>Dealer Commission</th> : ""}
                              {user_type == 1 ? <th>Commission Status</th> : ""}
                              <th>Order Satus</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody className="text-center">
                            {paginatedItems?.length ? (
                              <>
                                {paginatedItems?.map((datas, index) => {
                                  const phoneNumber =
                                    datas?.customer_phone?.replace("+91", "");
                                  return (
                                    // Removed unnecessary React Fragment wrapper
                                    <tr key={index}>
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
                                      {user_type == 1 ? (
                                        <td>
                                          <span>
                                            ₹
                                            {Math.round(
                                              datas?.dealer_commission
                                            )}
                                          </span>
                                        </td>
                                      ) : (
                                        ""
                                      )}

                                      {user_type == 1 ? (
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
                                      ) : (
                                        ""
                                      )}

                                      <td>
                                        {datas?.order_status == "pending" && (
                                          <span className="badge bg-warning">
                                            Pending
                                          </span>
                                        )}
                                        {datas?.order_status == "accepted" && (
                                          <span className="badge bg-info">
                                            Accepted
                                          </span>
                                        )}
                                        {datas?.order_status ==
                                          "processing" && (
                                          <span className="badge bg-primary">
                                            Processing
                                          </span>
                                        )}
                                        {datas?.order_status ==
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
                                              // ✅ Call the Next.js navigation function
                                              onClick={() =>
                                                handleViewOrder(
                                                  datas?.order_id
                                                )
                                              }
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
                                    colSpan={user_type == 1 ? 9 : 7}
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

export default MyOrders;