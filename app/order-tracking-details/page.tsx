// import React, { useLayoutEffect, useState } from "react";
// import { Helmet } from "react-helmet-async";
// import "./OrderTrack.css";
// import Userservice from "../../services/Cart";
// import { FaBox, FaCheck, FaRegUser, FaTruck } from "react-icons/fa";
// import noImage from "../../assets/images/No_Image_Available.jpg";
// import { useLocation, useNavigate } from "react-router-dom";
// import Loader from "../../components/common/Loader";
// import Logo from "../../assets/images/logo.png";

// const OrderTracking = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dynamicId = location.search ? location.search.substring(1) : null;
//   const [Items, setItems] = useState([]);
//   const [trackStatus, setTrackStatus] = useState([]);
//   const [product, setProduct] = useState([]);
//   const [message, setmessage] = useState([]);
//   const [isLoading, setIsLoading] = useState("");
//   const [itemStatus, setItemStatus] = useState(true);

//   const GetUserOrders = async () => {
//     Userservice.OrdersTracking({
//       order_number: dynamicId,
//     })
//       .then((res) => {
//         if (res?.status === true && res?.data?.docate_number) {
//           const docketNumber = res?.data?.docate_number;
//           setItems(res.data);
//           setProduct(res.data?.order_items);
//           setIsLoading(false);
//           setItemStatus(res.status);

//           Userservice.DeliveryTrack({
//             docket: docketNumber,
//           })
//             .then((res) => {
//               if (res.status === "true") {
//                 setTrackStatus(res?.data);
//               }
//             })
//             .catch((err) => {
//               console.log(err);
//               setIsLoading(false);
//             });
//         } else {
//           setIsLoading(false);
//           setmessage(res?.message);
//           setItemStatus(res.status);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         setIsLoading(false);
//       });
//   };

//   useLayoutEffect(() => {
//     GetUserOrders();
//   }, [location]);

//   let tracking_status = "";

//   if (trackStatus?.shipment_status === "SCREATED") {
//     tracking_status = "Shipment Created";
//   } else if (trackStatus?.shipment_status === "SCHECKIN") {
//     tracking_status = "If the shipment picked up by sequel staff";
//   } else if (trackStatus?.shipment_status === "SLINREC") {
//     tracking_status =
//       "If the shipment is at the hub and checked into the hub is at the hub";
//   } else if (trackStatus?.shipment_status === "SLINORIN") {
//     tracking_status = "Shipment Departed from Origin Hub";
//   } else if (trackStatus?.shipment_status === "SLINDEST") {
//     tracking_status = "Shipment Arrived at destination hub";
//   } else if (trackStatus?.shipment_status === "SDELASN") {
//     tracking_status = "Shipment out for delivery";
//   } else if (trackStatus?.shipment_status === "SDELVD") {
//     tracking_status = "Shipment is delivered";
//   } else if (trackStatus?.shipment_status === "SCANCELLED") {
//     tracking_status = "Shipment is cancelled";
//   } else {
//   }

//   return (
//     <>
//       <Helmet>
//         <title>Impel Store - Order Tracking</title>
//       </Helmet>
//       <section className="login">
//         {isLoading ? (
//           <Loader />
//         ) : (
//           <>
//             {" "}
//             <div className="container">
//               <div className="">
//                 <div className="row justify-content-center text-align-center">
//                   <div className="order-track-section mt-3">
//                     <article className="card">
//                       <div className="text-center p-3">
//                         <img src={Logo} alt="logo" style={{ width: "130px" }} />
//                       </div>

//                       {itemStatus === true ? (
//                         <>
//                           <div className="card-body">
//                             <h6>Order ID: #{Items?.order_id}</h6>
//                             <article className="card">
//                               <div className="card-body row">
//                                 <div className="col">
//                                   <strong>Estimated Delivery time:</strong>{" "}
//                                   <br />
//                                   {trackStatus?.estimated_delivery}
//                                 </div>
//                                 <div className="col">
//                                   <strong>Shipping BY:</strong> <br />
//                                   {trackStatus?.insurance}
//                                 </div>
//                                 <div className="col">
//                                   <strong>Status:</strong> <br />
//                                   {tracking_status}
//                                 </div>
//                                 <div className="col">
//                                   <strong>Tracking #:</strong> <br />
//                                   {trackStatus?.docket_no}
//                                 </div>
//                               </div>
//                             </article>

//                             <div className="track">
//                               <div
//                                 className={`step ${
//                                   trackStatus?.shipment_status === "SCREATED" ||
//                                   trackStatus?.shipment_status === "SCHECKIN" ||
//                                   trackStatus?.shipment_status === "SDELVD" ||
//                                   trackStatus?.shipment_status === "SDELASN"
//                                     ? "active"
//                                     : ""
//                                 }`}
//                               >
//                                 <span className="icon">
//                                   <FaCheck />
//                                 </span>
//                                 <span className="text">Order confirmed</span>
//                               </div>
//                               <div
//                                 className={`step ${
//                                   trackStatus?.shipment_status === "SCHECKIN" ||
//                                   trackStatus?.shipment_status === "SDELASN" ||
//                                   trackStatus?.shipment_status === "SDELVD"
//                                     ? "active"
//                                     : ""
//                                 }`}
//                               >
//                                 <span className="icon">
//                                   <FaRegUser />
//                                 </span>
//                                 <span className="text">Picked by courier</span>
//                               </div>
//                               <div
//                                 className={`step ${
//                                   trackStatus?.shipment_status === "SDELASN" ||
//                                   trackStatus?.shipment_status === "SDELVD"
//                                     ? "active"
//                                     : ""
//                                 }`}
//                               >
//                                 <span className="icon">
//                                   <FaTruck />
//                                 </span>
//                                 <span className="text">On the way</span>
//                               </div>
//                               <div
//                                 className={`step ${
//                                   trackStatus?.shipment_status === "SDELVD"
//                                     ? "active"
//                                     : ""
//                                 }`}
//                               >
//                                 <span className="icon">
//                                   <FaBox />
//                                 </span>
//                                 <span className="text">Ready for pickup</span>
//                               </div>
//                             </div>

//                             <hr />
//                             <ul className="row">
//                               {product?.map((datas) => (
//                                 <>
//                                   <li className="col-md-4">
//                                     <figure className="itemside mb-3">
//                                       <div className="aside">
//                                         <img
//                                           src={datas?.design_image}
//                                           className="img-sm border"
//                                           alt=""
//                                         />
//                                       </div>
//                                       <figcaption className="info">
//                                         <h6 className="title">
//                                           {datas?.design_name}
//                                         </h6>
//                                         {/* <h6>{datas?.net_weight} g.(Approx.)</h6>
//                                       <span className="text-muted">
//                                         ₹{numberFormat(datas?.item_total)}
//                                       </span> */}
//                                       </figcaption>
//                                     </figure>
//                                   </li>
//                                 </>
//                               ))}
//                             </ul>
//                             <hr />

//                             <div className="d-flex justify-content-center align-items-center">
//                               <button
//                                 className="view_all_btn px-4 py-2"
//                                 style={{ borderRadius: "8px" }}
//                                 onClick={() => navigate("/")}
//                               >
//                                 Back to Site
//                               </button>
//                             </div>
//                           </div>
//                         </>
//                       ) : (
//                         <>
//                           <div className="card-body">
//                             <h4 className="text-center">{message}</h4>
//                             <div className="d-flex justify-content-center align-items-center mt-4">
//                               <button
//                                 className="view_all_btn px-4 py-2"
//                                 style={{ borderRadius: "8px" }}
//                                 onClick={() => navigate("/")}
//                               >
//                                 Back to Site
//                               </button>
//                             </div>
//                           </div>
//                         </>
//                       )}
//                     </article>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </section>
//     </>
//   );
// };

// export default OrderTracking;
