// import React, { useEffect, useState } from "react";
// import { Link, useLocation, useParams } from "react-router-dom";
// import { Helmet } from "react-helmet-async";
// import BreadCrumb from "../../components/common/BreadCrumb";
// import Loader from "../../components/common/Loader";
// import axios from "axios";
// import profileService from "../../services/Home";
// import Userservice from "../../services/Cart";
// import noImage from "../../assets/images/No_Image_Available.jpg";


// const api = process.env.REACT_APP_API_KEY;

// const ReadyOrderDetails = () => {
//   const { id } = useParams();

//   const location = useLocation();
//   const dynamicId = location.search ? location.search.substring(1) : null;

//   const user_id = localStorage.getItem("user_id");
//   const user_type = localStorage.getItem("user_type");
//   const [Items, setItems] = useState([]);
//   const [status, setStatus] = useState();
//   const [product, setProduct] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [allPrices, setAllPrices] = useState([]);
//   const [trackStatus, setTrackStatus] = useState([]);

//   const GetUserOrders = async () => {
//     axios
//       .post(api + "ready/order-details", {
//         order_id: dynamicId,
//         user_id: user_id,
//         user_type: user_type,
//       })
//       .then((res) => {
//         if (res?.data?.status === true && res?.data?.data?.docate_number) {
//           const docketNumber = res?.data?.data?.docate_number;
//           setItems(res.data.data);
//           setProduct(res.data?.data?.order_items);
//           setStatus(res.data.data.order_status);
//           setIsLoading(false);

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
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         setIsLoading(false);
//       });
//   };

//   useEffect(() => {
//     GetUserOrders();
//   }, []);

//   useEffect(() => {
//     profileService
//       .GetProductsPrices()
//       .then((res) => {
//         setAllPrices(res?.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [id]);

//   var finalPrice = [
//     {
//       price_24k: allPrices?.price_24k,
//     },
//     {
//       sales_wastage: allPrices?.sales_wastage_rtd,
//     },
//     {
//       sales_wastage_discount: allPrices?.sales_wastage_discount_rtd,
//     },
//     {
//       show_estimate: allPrices?.show_estimate,
//     },
//   ];

//   const numberFormat = (value) =>
//     new Intl.NumberFormat("en-IN")?.format(Math?.round(value));

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
//         <title>Impel Store - Order Details</title>
//       </Helmet>
//       <section className="my-orders">
//         {isLoading ? (
//           <Loader />
//         ) : (
//           <>
//             <div className="container">
//               {status === false ? (
//                 <div className="row justify-content-center text-center">
//                   <div className="col-md-12">
//                     <div className="order-error-section pt-5">
//                       <div className="page">
//                         Ooops!!! The Order you are looking for is not found
//                       </div>
//                       <Link to="/" className="back-home">
//                         Back to home
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   {/* Order Details */}
//                   <div className="order_details">
//                     <div className="row">
//                       <div className="col-md-12">
//                         <BreadCrumb
//                           firstName="Home"
//                           firstUrl="/"
//                           secondName="My Orders"
//                           secondUrl="/my-ready-orders"
//                           thirdName="Order Details"
//                         />
//                       </div>
//                       <div className="col-md-4 mb-3">
//                         <div
//                           className="card"
//                           style={{
//                             border: "none",
//                             boxShadow: "2px 2px 2px  #ccc",
//                             height: "100%",
//                           }}
//                         >
//                           <div className="card-body">
//                             <h4 className="header-title">Order Information</h4>
//                             <table className="table">
//                               <tbody>
//                                 <tr>
//                                   <th scope="col">Order No :</th>
//                                   <td>#{Items?.order_id}</td>
//                                 </tr>
//                                 <tr>
//                                   <th scope="col">Order Status :</th>
//                                   {status == "pending" && (
//                                     <td>
//                                       <span className="badge bg-warning">
//                                         Pending
//                                       </span>
//                                     </td>
//                                   )}
//                                   {status == "accepted" && (
//                                     <td>
//                                       <span className="badge bg-info">
//                                         Accepted
//                                       </span>
//                                     </td>
//                                   )}
//                                   {status == "processing" && (
//                                     <td>
//                                       <span className="badge bg-primary">
//                                         Processing
//                                       </span>
//                                     </td>
//                                   )}
//                                   {status == "completed" && (
//                                     <td>
//                                       <span className="badge bg-success">
//                                         Completed
//                                       </span>
//                                     </td>
//                                   )}
//                                 </tr>
//                                 <tr>
//                                   <th scope="col">Order Date :</th>
//                                   <td>{Items?.order_date}</td>
//                                 </tr>
//                                 <tr>
//                                   <th scope="col">Order Time :</th>
//                                   <td>{Items?.order_time}</td>
//                                 </tr>
//                                 <tr>
//                                   <th scope="col">Payment Method :</th>
//                                   <td>{Items?.payment_method}</td>
//                                 </tr>
//                                 <tr>
//                                   <th scope="col">Payment Status :</th>
//                                   {Items?.payment_status == 1 ? (
//                                     <td>
//                                       <span className="badge bg-success">
//                                         Paid
//                                       </span>
//                                     </td>
//                                   ) : (
//                                     <td>
//                                       <span className="badge bg-danger">
//                                         UnPaid
//                                       </span>
//                                     </td>
//                                   )}
//                                 </tr>
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="col-md-4 mb-3">
//                         <div
//                           className="card"
//                           style={{
//                             border: "none",
//                             boxShadow: "2px 2px 2px  #ccc",
//                             height: "100%",
//                           }}
//                         >
//                           <div className="card-body">
//                             <h4 className="header-title">
//                               Customer Information
//                             </h4>
//                             <table className="table">
//                               <tbody>
//                                 <tr>
//                                   <th scope="col">Name :</th>
//                                   <td>{Items?.customer}</td>
//                                 </tr>
//                                 <tr>
//                                   <th scope="col">Email :</th>
//                                   <td>{Items?.customer_email}</td>
//                                 </tr>
//                                 <tr>
//                                   <th scope="col">Phone :</th>
//                                   <td>
//                                     {Items?.customer_phone?.replace("+91", "")}
//                                   </td>
//                                 </tr>
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="col-md-4 mb-3">
//                         <div
//                           className="card"
//                           style={{
//                             border: "none",
//                             boxShadow: "2px 2px 2px  #ccc",
//                             height: "100%",
//                           }}
//                         >
//                           <div className="card-body shipping-Information">
//                             <h4 className="header-title">
//                               Shipping Information
//                             </h4>
//                             <table className="table">
//                               <tbody>
//                                 <tr>
//                                   <th scope="col">Address :</th>
//                                   <td>{Items?.address}</td>
//                                 </tr>
//                                 <tr>
//                                   <th scope="col">City :</th>
//                                   <td>{Items?.city}</td>
//                                 </tr>
//                                 <tr>
//                                   <th scope="col">State :</th>
//                                   <td>{Items?.state}</td>
//                                 </tr>
//                                 <tr>
//                                   <th scope="col">Pin-Code :</th>
//                                   <td>{Items?.pincode}</td>
//                                 </tr>
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Order Products */}
//                   <div className="order_products">
//                     <div className="row mb-3">
//                       <div className="col-lg-12 col-md-12">
//                         <div
//                           className="card"
//                           style={{
//                             border: "none",
//                             boxShadow: "2px 2px 2px  #ccc",
//                           }}
//                         >
//                           <div className="card-body">
//                             <div className="table-responsive">
//                               <table className="table mb-0">
//                                 <thead className="table-light text-center">
//                                   <tr>
//                                     <th>IMAGE</th>
//                                     <th>NAME</th>
//                                     <th>QTY.</th>
//                                     <th>NET WEIGHT</th>
//                                     <th>METAL VALUE</th>
//                                     <th>MAKING CHARGE</th>
//                                     <th>TOTAL AMOUNT</th>
//                                   </tr>
//                                 </thead>
//                                 <tbody className="text-center">
//                                   {product?.map((datas) => {
//                                     var is_estimate =
//                                       product && finalPrice[3]?.show_estimate
//                                         ? finalPrice[3].show_estimate[
//                                             datas.sub_item_id
//                                           ] || 0
//                                         : 0;
//                                     return (
//                                       <>
//                                         <tr>
//                                           <td>
//                                             <img
//                                               src={`https://api.indianjewelcast.com/TagImage/${datas?.barcode}.jpg`}
//                                               onError={(e) => {
//                                                 e.target.onerror = null;
//                                                 e.target.src =
//                                                   noImage?.No_Image_Available ||
//                                                   "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
//                                               }}
//                                               alt=""
//                                               style={{ width: "100px" }}
//                                             />
//                                           </td>
//                                           <td>
//                                             <span>{datas?.design_name}</span>
//                                           </td>

//                                           <td>
//                                             <span>{datas?.quantity}</span>
//                                           </td>
//                                           <td>
//                                             <span>{datas?.net_weight} g.</span>
//                                           </td>

//                                           {is_estimate == 1 ? (
//                                             <>
//                                               <td>
//                                                 <span>
//                                                   ₹
//                                                   {numberFormat(
//                                                     datas?.metal_value
//                                                   )}
//                                                 </span>
//                                               </td>
//                                             </>
//                                           ) : (
//                                             <>
//                                               <td>-</td>
//                                             </>
//                                           )}

//                                           {is_estimate == 1 ? (
//                                             <>
//                                               <td>
//                                                 <span>
//                                                   ₹
//                                                   {datas?.making_charge_discount >
//                                                   0
//                                                     ? numberFormat(
//                                                         datas?.making_charge_discount
//                                                       )
//                                                     : numberFormat(
//                                                         datas?.making_charge
//                                                       )}
//                                                 </span>
//                                               </td>
//                                             </>
//                                           ) : (
//                                             <>
//                                               <td>-</td>
//                                             </>
//                                           )}

//                                           <td>
//                                             <span>
//                                               <strong>
//                                                 ₹
//                                                 {numberFormat(
//                                                   datas?.item_total
//                                                 )}
//                                               </strong>
//                                             </span>
//                                           </td>
//                                         </tr>
//                                       </>
//                                     );
//                                   })}
//                                 </tbody>
//                               </table>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Order Payments */}
//                   <div className="order_payments order_details">
//                     <div className="row justify-content-end">
//                       <div className="col-lg-4 col-md-4">
//                         <div
//                           className="card"
//                           style={{
//                             border: "none",
//                             boxShadow: "2px 2px 2px  #ccc",
//                           }}
//                         >
//                           <div className="card-body">
//                             <h4 className="header-title">Order Summary</h4>
//                             <div className="table-responsive">
//                               <table className="table mb-0">
//                                 <tbody>
//                                   <tr>
//                                     <th>
//                                       <strong>SUB TOTAL :</strong>
//                                     </th>
//                                     <td>₹{numberFormat(Items?.sub_total)}</td>
//                                   </tr>
//                                   <tr>
//                                     <th>
//                                       <strong>GST (3%) :</strong>
//                                     </th>
//                                     <td>₹{numberFormat(Items?.gst_amount)}</td>
//                                     {/* <td>₹{numberFormat(Items?.sub_total * 0.03)}</td> */}
//                                   </tr>
//                                   {Items?.dealer_code &&
//                                     Items?.dealer_discount_type &&
//                                     Items?.dealer_discount_value && (
//                                       <tr>
//                                         <th>
//                                           <strong className="text-success">
//                                             Dealer Discount <br />(
//                                             {Items?.dealer_code}) &nbsp;
//                                             <span>
//                                               {Items?.dealer_discount_type ===
//                                               "percentage" ? (
//                                                 <>
//                                                   (-
//                                                   {Items?.dealer_discount_value}
//                                                   %)
//                                                 </>
//                                               ) : (
//                                                 <></>
//                                               )}
//                                             </span>
//                                           </strong>
//                                           &nbsp;:
//                                         </th>
//                                         <td className="text-success">
//                                           <p className="m-0">
//                                             {Items?.dealer_discount_type ===
//                                             "percentage"
//                                               ? `- ₹${numberFormat(
//                                                   (Items?.charges *
//                                                     Items?.dealer_discount_value) /
//                                                     100
//                                                 )}`
//                                               : `- ₹${numberFormat(
//                                                   Items?.dealer_discount_value
//                                                 )}`}
//                                           </p>
//                                         </td>
//                                       </tr>
//                                     )}

//                                   <tr>
//                                     <th>TOTAL :</th>
//                                     <td className="font-weight-bold">
//                                       ₹{Items?.total?.toLocaleString("en-US")}
//                                     </td>
//                                   </tr>
//                                 </tbody>
//                               </table>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </>
//         )}
//       </section>
//     </>
//   );
// };

// export default ReadyOrderDetails;
