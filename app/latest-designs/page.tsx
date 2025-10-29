// import React from "react";
// import homeService from "../../services/Home";
// import { Helmet } from "react-helmet-async";
// import { Link } from "react-router-dom";
// import { FaLongArrowAltLeft } from "react-icons/fa";
// import { motion } from "framer-motion";
// import noImage from "../../assets/images/No_Image_Available.jpg";
// import { useQuery } from "@tanstack/react-query";

// const LatestDesign = () => {
//   const { data: designs, isLoading } = useQuery({
//     queryKey: ["RecentAdd"],
//     queryFn: () => homeService.RecentAdd(),
//     select: (data) => data?.data || [],
//   });

//   const numberFormat = (value) =>
//     new Intl.NumberFormat("en-IN")?.format(Math?.round(value));

//   const shimmerItems = Array(20).fill(null);

//   return (
//     <>
//       <Helmet>
//         <title>Impel Store - Latest designs</title>
//       </Helmet>
//       <section className="categories">
//         <div className="container">
//           <div className="categories_header">
//             <h3>Latest Designs</h3>
//           </div>
//           <div className="categories_data">
//             {isLoading ? (
//               <>
//                 <div className="row">
//                   {shimmerItems.map((_, index) => (
//                     <div className="col-lg-3 col-md-6 col-12">
//                       <div key={index} className="shimmer-product">
//                         <div className="shimmer-image"></div>
//                         <div className="shimmer-price"></div>
//                         <div className="shimmer-price"></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="row">
//                   {designs?.length > 0 ? (
//                     <>
//                       {designs?.slice(0, 200)?.map((data) => {
//                         return (
//                           <>
//                             <div className="col-md-3 col-sm-4 col-xs-6">
//                               <motion.div
//                                 className="item-product text-center"
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 transition={{ duration: 0.5 }}
//                               >
//                                 <Link to={`/shopdetails/${encodeURIComponent(data.name.toLowerCase().replace(/\s+/g, '-'))}/${data?.code}`}
//                             state={{ id: data.id, name: data.name }}>
//                                   <div className="product-thumb">
//                                     {data?.image ? (
//                                       <>
//                                         <motion.img
//                                           src={data?.image}
//                                           alt={data?.name}
//                                           className="w-100"
//                                           initial={{ opacity: 0 }}
//                                           animate={{ opacity: 1 }}
//                                           transition={{ duration: 0.5 }}
//                                           whileHover={{ scale: 1.05 }}
//                                         />
//                                       </>
//                                     ) : (
//                                       <>
//                                         <motion.img
//                                           src={noImage}
//                                           className="w-100"
//                                           initial={{ opacity: 0 }}
//                                           animate={{ opacity: 1 }}
//                                           transition={{ duration: 0.5 }}
//                                           whileHover={{ scale: 1.05 }}
//                                         />
//                                       </>
//                                     )}
//                                   </div>
//                                   <div className="product-info d-grid">
//                                     {data?.making_charge_discount_18k > 0 ? (
//                                       <>
//                                         <del style={{ color: "#000" }}>
//                                           ₹
//                                           {numberFormat(
//                                             data?.making_charge_18k +
//                                               data?.metal_value_18k
//                                           )}
//                                         </del>
//                                         <label>
//                                           <strong className="text-success">
//                                             ₹
//                                             {numberFormat(
//                                               data?.metal_value_18k +
//                                                 data?.making_charge_discount_18k
//                                             )}
//                                           </strong>
//                                         </label>
//                                       </>
//                                     ) : (
//                                       <strong className="text-success">
//                                         ₹{numberFormat(data?.total_amount_18k)}
//                                       </strong>
//                                     )}
//                                   </div>
//                                 </Link>
//                               </motion.div>
//                             </div>
//                           </>
//                         );
//                       })}
//                     </>
//                   ) : (
//                     <>
//                       <div
//                         className="categoriesData-not text-center"
//                         style={{
//                           fontSize: "35px",
//                           fontWeight: "600",
//                           marginTop: "150px",
//                         }}
//                       >
//                         <p>
//                           Unfortunately, latest-designs is not available at the
//                           moment.
//                         </p>
//                       </div>
//                       <div className="text-center mt-md-3">
//                         <Link
//                           to="/"
//                           className="view_all_btn px-4 py-2"
//                           style={{ borderRadius: "8px" }}
//                         >
//                           <FaLongArrowAltLeft className="mr-2" /> &nbsp;Back to
//                           Home
//                         </Link>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default LatestDesign;
