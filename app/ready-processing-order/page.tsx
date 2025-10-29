// 'use client'; // This directive is necessary for App Router Client Components

// import React, {
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import Link from "next/link";
// import Head from 'next/head'; // Using Head for metadata (if using Pages Router) or adjusting for App Router's metadata setup
// import { usePathname, useRouter, useSearchParams } from "next/navigation"; // App Router Hooks

// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import axios from "axios";
// import { BsCartDash, BsHandbagFill } from "react-icons/bs";
// import toast from "react-hot-toast";
// import { CgSpinner } from "react-icons/cg";
// import { ReadyDesignCartSystem } from "./context/ReadyDesignCartContext";
// import profileService from "./services/Home";
// import { Accordion } from "react-bootstrap";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import { motion } from "framer-motion";
// import { FaLongArrowAltLeft } from "react-icons/fa";

// // Import external client-side utility safely (assuming its implementation)
// // For now, we manually handle the logic `usePreviousPath` implemented here.

// // Static asset paths corrected for Next.js public folder
// const noImage = "/assets/images/No_Image_Available.jpg";
// const easyReturn = "/assets/images/Tags/Warranty.png";
// const plating = "/assets/images/Tags/Jewellery.png";
// const auth925 = "/assets/images/Tags/Auth925.png";

// const api = process.env.NEXT_PUBLIC_API_KEY || process.env.REACT_APP_API_KEY;

// // Assuming BreadCrumb component is converted or uses standard components
// const BreadCrumb = ({ firstName, firstUrl, secondName, secondUrl }) => (
//     <nav aria-label="breadcrumb">
//         <ol className="breadcrumb">
//             <li className="breadcrumb-item"><Link href={firstUrl}>{firstName}</Link></li>
//             <li className="breadcrumb-item"><Link href={secondUrl}>{secondName}</Link></li>
//             {/* Third item (current page name) will be added below */}
//         </ol>
//     </nav>
// );

// const ReadyDetails = ({ params }) => { // Receiving params if used as app/ready-details/[id]/page.js
//   const router = useRouter();
//   const currentPath = usePathname();
//   const searchParams = useSearchParams();
  
//   // Use slug from URL (assuming either dynamic route or query parameter)
//   // We prioritize params.id if available from a dynamic route segment
//   const id = params?.id || searchParams.get('id'); 

//   // Client-side state for local storage values
//   const [phone, setPhone] = useState(null);
//   const [user_id, setUser_id] = useState(null);
//   const [loginPath, setLoginPath] = useState(null);

//   useEffect(() => {
//       if (typeof window !== "undefined") {
//           setPhone(localStorage.getItem("phone"));
//           setUser_id(localStorage.getItem("user_id"));
//           setLoginPath(sessionStorage.getItem("currentPath"));
//       }
//   }, []);

//   const { dispatch: addtocartDispatch } = useContext(ReadyDesignCartSystem);

//   const [isLoading, setIsLoading] = useState(true);
//   const [details, setDetails] = useState(null);
//   const [cartItems, setCartItems] = useState([]);
//   const [spinner, setSpinner] = useState(false);
//   const [allPrices, setAllPrices] = useState(null);
//   const [accordionOpen, setAccordionOpen] = useState(true);

//   const toggleAccordion = () => {
//     setAccordionOpen(!accordionOpen);
//   };
  
//   // --- Data Fetching Effects ---
  
//   // Fetch Product Details and Prices
//   useEffect(() => {
//     if (!id) return;
    
//     const getDetails = () => {
//       fetch("https://api.indianjewelcast.com/api/Tag/GetAll", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           PageNo: 1,
//           PageSize: 100,
//           DeviceID: 0,
//           SearchText: id,
//         }),
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           setDetails(data?.Tags?.[0] || null);
//           setIsLoading(false);
//         })
//         .catch((err) => {
//           console.log(err);
//           setDetails(null);
//           setIsLoading(false);
//         });
//     };

//     getDetails();
//     GetUserCartList();
//   }, [id, phone]); // Added phone to dependency array

//   // Fetch Product Prices
//   useEffect(() => {
//     profileService
//       .GetProductsPrices()
//       .then((res) => {
//         setAllPrices(res?.data || null);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []); // Run once on client mount

//   const GetUserCartList = async () => {
//     if (!phone || !api) return;
//     axios
//       .post(api + "ready/cart-list", { phone: phone })
//       .then((res) => {
//         setCartItems(res?.data?.data?.carts || []);
//       })
//       .catch((err) => console.log(err));
//   };
  
//   // --- Price Calculation Logic (Moved inside render to use hooks) ---
  
//   const calculatePrices = () => {
//     if (!details || !allPrices) {
//         return {};
//     }
    
//     const price_24k = allPrices?.price_24k?.[details.SubItemID] || 0;
//     const sales_wastage_of_category = allPrices?.sales_wastage_rtd?.[details.SubItemID] || 0;
//     const sales_wastage_discount_of_category = allPrices?.sales_wastage_discount_rtd?.[details.SubItemID] || 0;
//     const is_estimate = allPrices?.show_estimate?.[details.SubItemID] || 0;
    
//     let metal_value = price_24k * (details?.Touch / 100) * details?.NetWt || 0;

//     let labour_charge = price_24k * (sales_wastage_of_category / 100) || 0;

//     if (labour_charge > 0) {
//         labour_charge = labour_charge * details?.NetWt || 0;
//     }

//     let labour_charge_discount = 0;
//     if (sales_wastage_discount_of_category > 0) {
//         labour_charge_discount =
//         labour_charge -
//         (labour_charge * sales_wastage_discount_of_category) / 100;
//     } 
    
//     return { 
//         metal_value, 
//         labour_charge, 
//         labour_charge_discount, 
//         is_estimate 
//     };
//   };

//   const { metal_value, labour_charge, labour_charge_discount, is_estimate } = calculatePrices();

//   const numberFormat = (value) =>
//     new Intl.NumberFormat("en-IN")?.format(Math?.round(value));

//   // --- Cart/Navigation Handlers ---
  
//   const handleAddToCart = (product) => {
//     if (!phone) {
//         // Should not happen if button is disabled, but good safety check
//         UserLogin();
//         return;
//     }
    
//     const total_amount = labour_charge_discount > 0
//         ? metal_value + labour_charge_discount
//         : metal_value + labour_charge || 0;
    
//     const payload = { id: product?.TagNo };
//     setSpinner(true);
    
//     axios
//       .post(api + "ready/cart-store", {
//         phone: phone,
//         tag_no: details?.TagNo,
//         group_name: details?.GroupName,
//         name: id,
//         size: details?.Size1,
//         gross_weight: details?.GrossWt,
//         net_weight: details?.NetWt,
//         item_group_id: details?.ItemGroupID,
//         item_id: details?.ItemID,
//         sub_item_id: details?.SubItemID,
//         style_id: details?.StyleID,
//         quantity: 1,
//         barcode: details?.Barcode,
//         company_id: 4,
//         metal_value: metal_value || 0,
//         making_charge: labour_charge || 0,
//         making_charge_discount: labour_charge_discount || 0,
//         total_amount: total_amount,
//       })
//       .then((res) => {
//         if (res?.data?.status === true) {
//           toast.success(res?.data?.message);
//           GetUserCartList();
//           addtocartDispatch({ type: "ADD_TO_CART", payload });
//         } else {
//           toast.error(res?.data?.message);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         toast.error("Failed to add to cart.");
//       })
//       .finally(() => setSpinner(false));
//   };

//   const UserLogin = () => {
//     if (typeof window !== "undefined") {
//         // Use router.replace to handle redirect after login better
//         localStorage.setItem("redirectPath", currentPath);
//         router.push('/login');
//     }
//   };

//   const handleBackClick = () => {
//     // Check the previous page's path from session storage (App Router doesn't guarantee history state)
//     // In Next.js, navigate(-1) (router.back()) is generally preferred unless specific history is needed.
//     // The original logic checks loginPath from sessionStorage.

//     if (loginPath?.includes('/login')) {
//       router.push('/shop');
//     } else {
//       router.back(); // Use router.back() for reliable back navigation
//     }
//   };

//   // --- Loading/Error State ---

//   if (isLoading || !details) {
//     return (
//         <section className="shop_details">
//             <div className="container">
//                 <div className="Shop_product">
//                     <div className="row justify-content-center">
//                         <div className="col-md-10">
//                             <Skeleton height={30} width="40%" className="mb-4" />
//                             <div className="row">
//                                 <div className="col-md-6">
//                                     <Skeleton style={{ height: "526px" }} width="100%" />
//                                 </div>
//                                 <div className="col-md-6">
//                                     <Skeleton height={30} width="60%" />
//                                     <Skeleton count={4} height={20} width="50%" className="my-2" />
//                                     <Skeleton height={150} width="100%" className="mt-3" />
//                                     <Skeleton height={50} width="100%" className="mt-3" />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
//   }

//   // --- Render ---

//   return (
//     <>
//       <Head>
//         <title>
//           Impel Store - {details?.GroupName ? `(${details.GroupName})` : ""}
//         </title>
//         <meta name="description" content={`Details for Ready Jewelry ${details?.TagNo}`} />
//       </Head>

//       <section className="shop_details">
//         <div className="container">
//           <div className="Shop_product">
//             <div className="row justify-content-center">
//               <div className="col-md-10">
//                 <div className="breadcumb-section-btn mb-4">
//                   <BreadCrumb
//                     firstName="Home"
//                     firstUrl="/"
//                     secondName="Ready to dispatch"
//                     secondUrl="/ready-to-dispatch"
//                   />
//                   {/* Current page in breadcrumb: */}
//                   <div className="breadcrumb-item active">{details?.TagNo}</div> 
                  
//                   <button
//                     className="btn btn-outline-dark d-flex align-items-center text-center ms-auto"
//                     onClick={router.back}
//                   >
//                     <FaArrowLeftLong />
//                   </button>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6">
//                     <div id="imageMagnifyer">
//                       <motion.img
//                         src={`https://api.indianjewelcast.com/TagImage/${details?.Barcode}.jpg`}
//                         alt={`Image of ${details?.TagNo}`}
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = noImage;
//                         }}
//                         className="w-100"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5 }}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <>
//                       <div>
//                         <h4>
//                           <b>{details?.TagNo}</b>
//                         </h4>
//                         <h5 className="mb-3">
//                           Metal : <strong>{details?.GroupName}</strong>
//                         </h5>

//                         <h5 className="mb-3">
//                           Size : <strong>{details?.Size1 || "-"}</strong>
//                         </h5>
//                         {is_estimate == 1 && (
//                           <>
//                             <div className="mt-3">
//                               <Accordion className="accordian">
//                                 <Accordion.Item eventKey="3" className="my-2">
//                                   <Accordion.Header onClick={toggleAccordion}>
//                                     Approximate - Estimate
//                                   </Accordion.Header>
//                                   <Accordion.Body className="p-0">
//                                     <table className="table table-bordered mb-0">
//                                       <tbody>
//                                         <tr>
//                                           <th>Gross Weight</th>
//                                           <td>
//                                             {details?.GrossWt} g. (Approx.)
//                                           </td>
//                                         </tr>
//                                         <tr>
//                                           <th>Net Weight</th>
//                                           <td>
//                                             {details?.NetWt} g. (Approx.)
//                                           </td>
//                                         </tr>
//                                         <tr>
//                                           <th>Metal value</th>
//                                           <td>
//                                             ₹{numberFormat(metal_value)}
//                                           </td>
//                                         </tr>
//                                         <tr>
//                                           <th>Making charge</th>
//                                           {labour_charge_discount > 0 &&
//                                           user_id ? (
//                                             <td>
//                                               <del>
//                                                 ₹{numberFormat(labour_charge)}
//                                               </del>{" "}
//                                               &nbsp;{" "}
//                                               <strong>
//                                                 ₹
//                                                 {numberFormat(
//                                                   labour_charge_discount
//                                                 )}
//                                               </strong>
//                                             </td>
//                                           ) : (
//                                             <td>
//                                               <>
//                                                 <strong>
//                                                   ₹
//                                                   {numberFormat(
//                                                     labour_charge
//                                                   )}
//                                                 </strong>
//                                               </>
//                                             </td>
//                                           )}
//                                         </tr>
//                                         <tr>
//                                           <th>Total Amount</th>
//                                           {labour_charge_discount > 0 &&
//                                           user_id ? (
//                                             <td>
//                                               <strong className="text-success">
//                                                 ₹
//                                                 {numberFormat(
//                                                   metal_value +
//                                                     labour_charge_discount
//                                                 )}
//                                               </strong>
//                                             </td>
//                                           ) : (
//                                             <td>
//                                               <>
//                                                 <strong className="text-success">
//                                                   ₹
//                                                   {numberFormat(
//                                                     metal_value +
//                                                       labour_charge
//                                                   )}
//                                                 </strong>
//                                               </>
//                                             </td>
//                                           )}
//                                         </tr>
//                                       </tbody>
//                                     </table>
//                                   </Accordion.Body>
//                                 </Accordion.Item>
//                               </Accordion>
//                               {accordionOpen && (
//                                 <div className="mt-3">
//                                   <table className="table table-bordered">
//                                     <tbody>
//                                       <tr>
//                                         <th>Total Amount</th>
//                                         {labour_charge_discount > 0 &&
//                                         user_id ? (
//                                           <td>
//                                             <del>
//                                               ₹
//                                               {numberFormat(
//                                                 labour_charge + metal_value
//                                               )}
//                                             </del>{" "}
//                                             &nbsp;{" "}
//                                             <strong className="text-success">
//                                               ₹
//                                               {numberFormat(
//                                                 labour_charge_discount +
//                                                   metal_value
//                                               )}
//                                             </strong>
//                                           </td>
//                                         ) : (
//                                           <td>
//                                             <>
//                                               <strong className="text-success">
//                                                 ₹
//                                                 {numberFormat(
//                                                   metal_value + labour_charge
//                                                 )}
//                                               </strong>
//                                             </>
//                                           </td>
//                                         )}
//                                       </tr>
//                                     </tbody>
//                                   </table>
//                                 </div>
//                               )}
//                             </div>
//                           </>
//                         )}
//                       </div>
//                       <div className="d-flex align-items-center gap-2">
//                         {phone ? (
//                           <>
//                             {cartItems?.find((item) => item?.tag_no === details?.TagNo) ? (
//                               // If already in cart → show cart button
//                               <Link className="btn btn-outline-dark" href="/ready-design-cart">
//                                 <BsCartDash style={{ fontSize: "26px", cursor: "pointer" }} />
//                               </Link>
//                             ) : (
//                               // Add to Cart
//                               <button
//                                 className="btn btn-outline-dark"
//                                 onClick={() => handleAddToCart(details)}
//                                 disabled={spinner}
//                               >
//                                 {spinner ? (
//                                   <CgSpinner size={20} className="animate_spin" />
//                                 ) : (
//                                   <BsHandbagFill style={{ fontSize: "26px", cursor: "pointer" }} />
//                                 )}
//                               </button>
//                             )}

//                             {/* Back to Shop button */}
//                             <button
//                               className="btn btn-outline-dark px-4 d-flex align-items-center"
//                               style={{ borderRadius: "8px" }}
//                               onClick={handleBackClick}
//                             >
//                               <FaLongArrowAltLeft className="me-2" size={18} />
//                               Back to Shop
//                             </button>
//                           </>
//                         ) : (
//                           <>
//                             {/* If not logged in → login first */}
//                             <button
//                               className="btn btn-outline-dark"
//                               onClick={UserLogin}
//                             >
//                               <BsHandbagFill style={{ fontSize: "26px", cursor: "pointer" }} />
//                             </button>

//                             <button
//                               className="btn btn-outline-dark px-4 d-flex align-items-center"
//                               style={{ borderRadius: "8px" }}
//                               onClick={handleBackClick}
//                             >
//                               <FaLongArrowAltLeft className="me-2" size={18} />
//                               Back to Shop
//                             </button>
//                           </>
//                         )}
//                       </div>

//                       <>
//                         {cartItems &&
//                         !cartItems?.find((item) => item?.tag_no === details?.TagNo) && (
//                           <div className="discount-info">
//                             <span>
//                               To get Maximum Discount apply coupon code in
//                               cart.
//                             </span>
//                           </div>
//                         )}
//                       </>

//                       <div className="design_details_spec">
//                         <div className="design_details_spec_box">
//                           <img src={easyReturn} alt="easy_return" />
//                           <span>Easy 7 Days Return Policy</span>
//                         </div>
//                         <div className="design_details_spec_box">
//                           <img src={plating} alt="Lifetime Plating" />
//                           <span>Free Life Time Plating</span>
//                         </div>
//                         <div className="design_details_spec_box">
//                           <img src={auth925} alt="easy_return" />
//                           <span>Authentic 925 Silver</span>
//                         </div>
//                         <div className="design_details_spec_box">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             width="30"
//                             height="30"
//                             fill="currentColor"
//                             className="bi bi-currency-rupee"
//                             viewBox="0 0 16 16"
//                           >
//                             <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
//                           </svg>
//                           <span>Cod Available</span>
//                         </div>
//                       </div>
//                     </>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default ReadyDetails;