// import React, { useState, useEffect, useContext } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import UserService from "../../services/Cart";
// import profileService from "../../services/Auth";
// import toast from "react-hot-toast";
// import { Col, Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
// import { CgSpinner } from "react-icons/cg";
// import { FaLongArrowAltLeft } from "react-icons/fa";
// import { IoIosCloseCircleOutline } from "react-icons/io";
// import { MdDelete } from "react-icons/md";
// import emptycart from "../../assets/images/empty-cart.png";
// import { Helmet } from "react-helmet-async";
// import { CartSystem } from "../../context/CartContext";
// import { ProfileSystem } from "../../context/ProfileContext";
// import Loader from "../../components/common/Loader";
// import axios from "axios";
// import { Spin } from "antd";
// import { LoadingOutlined } from "@ant-design/icons";

// const api = process.env.REACT_APP_API_KEY;

// const Cart = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { dispatch: profilename, state: namestate } = useContext(ProfileSystem);
//   const { dispatch: removefromcartDispatch } = useContext(CartSystem);
//   const { dispatch: resetcartcount } = useContext(CartSystem);

//   const Phone = localStorage.getItem("phone");
//   const user_id = localStorage.getItem("user_id");
//   const Verification = localStorage.getItem("verification");

//   const [isLoading, setIsLoading] = useState(true);
//   const [Items, setItems] = useState([]);
//   const [dealer_code, setDealer_Code] = useState("");
//   const [code, setCode] = useState("");
//   const [isFormEmpty, setIsFormEmpty] = useState("");
//   const [show, setShow] = useState(false);
//   const [removingItemId, setRemovingItemId] = useState(null);
//   const [spinner, setSpinner] = useState(false);
//   const [total, setTotal] = useState(0);

//   const [pin_code, setPin_Code] = useState("");
//   const [pin_code_err, setPin_Code_Err] = useState("");
//   const [pin_code_msg, setPin_Code_Msg] = useState("");
//   const [pin_code_loader, setPin_Code_Loader] = useState(false);
//   const [pin_code_valid, setPin_Code_Valid] = useState(false);

//   const [docket_Number, setDocket_Number] = useState([]);

//   const handlePincode = (e) => {
//     const value = e.target.value;
//     if (value.length <= 6 && /^[0-9]*$/.test(value)) {
//       setPin_Code(value);
//     }
//   };

//   const ApplyPincode = (e) => {
//     e.preventDefault();
//     setPin_Code_Loader(true);
//     UserService.PinCodeCheck({
//       token: "d55c9549f11637d0ad4d2808ffc3fcaa",
//       pin_code: pin_code,
//     })
//       .then((res) => {
//         if (res?.status === "true") {
//           setPin_Code_Err("Service available");
//           setPin_Code_Msg("");
//           setPin_Code_Valid(true);
//           setPin_Code_Loader(false);
//         } else if (res?.status === "false") {
//           setPin_Code_Err("");
//           setPin_Code_Err("Service available");
//           // setPin_Code_Msg("Service not available");
//           setPin_Code_Valid(true);
//           setPin_Code_Loader(false);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         setPin_Code_Valid(false);
//         setPin_Code_Loader(false);
//       });
//   };

//   // user profile functionlity
//   const [showEdit, setShowEdit] = useState(false);
//   const [profileData, setProfileData] = useState([]);
//   const [selectedData, setSelectedData] = useState([]);
//   const [city, setcity] = useState();
//   const [shipping_city, setShipping_city] = useState();
//   const [isChecked, setIsChecked] = useState(false);
//   const [valid, setValid] = useState("");
//   const [message, setMessage] = useState(false);
//   const [userData, setUserData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     pincode: "",
//     shipping_address: "",
//     shipping_pincode: "",
//     shipping_state: "",
//     shipping_city: "",
//     gst_no: "",
//     pan_no: "",
//     state: "",
//     city: "",
//     states: "",
//     address_same_as_company: "",
//   });

//   const [error, setError] = useState({
//     nameErr: "",
//     emailErr: "",
//     addressErr: "",
//     pincodeErr: "",
//     stateErr: "",
//     cityErr: "",
//     pancardErr: "",
//     gstErr: "",
//     shipping_address_err: "",
//     shipping_pincode_err: "",
//     shipping_state_err: "",
//     shipping_city_err: "",
//   });

//   const fetchCity = async (stateId) => {
//     await profileService
//       .getCity({ state_id: stateId })
//       .then((res) => {
//         setcity(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const fetchShippingCity = async (cityId) => {
//     await profileService
//       .getCity({ state_id: cityId })
//       .then((res) => {
//         setShipping_city(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const getProfile = async () => {
//   await profileService
//     .getProfile({ phone: Phone })
//     .then((res) => {
//       const Billing_shipping_state = res.data.state.name;
//       const Billing_shipping_city = res.data.city.name;
//       const shipping_state_name = res.data.shipping_state.name;
//       const shipping_city_name = res.data.shipping_city.name;
      
//       setProfileData({
//         ...res.data,
//         state_name: Billing_shipping_state,
//         city_name: Billing_shipping_city,
//         shipping_state_name: shipping_state_name,
//         shipping_city_name: shipping_city_name,
//         state: res.data.state.id,        // State ID
//         city: res.data.city.id,           // City ID
//         shipping_state: res.data.shipping_state.id,  // Shipping state ID
//         shipping_city: res.data.shipping_city.id,    // Shipping city ID
//       });
      
//       setUserData({
//         ...res.data,
//         state_name: Billing_shipping_state,
//         city_name: Billing_shipping_city,
//         shipping_state_name: shipping_state_name,
//         shipping_city_name: shipping_city_name,
//         state: res.data.state.id,        // State ID
//         city: res.data.city.id,           // City ID
//         shipping_state: res.data.shipping_state.id,  // Shipping state ID
//         shipping_city: res.data.shipping_city.id,    // Shipping city ID
//       });
      
//       res.data.state.id && fetchCity(res.data.state.id);
//       res.data.shipping_state.id &&
//         fetchShippingCity(res.data.shipping_state.id);
//       setIsLoading(false);
//     })
//     .catch((err) => {
//       console.log(err);
//       setIsLoading(false);
//     });
// };
// useEffect(() => {
//   if (userData.shipping_state) {
//     fetchShippingCity(userData.shipping_state);
//   }
// }, [userData.shipping_state]);
//   const handleProfileData = async (data) => {
//     setSelectedData(data);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "pan_no" && value.length > 10) {
//       e.target.value = value.slice(0, 10);
//     }

//     if (name === "state") {
//       setUserData({
//         ...userData,
//         state: value,
//         city: "",
//       });
//     } else if (name === "shipping_state") {
//       setUserData({
//         ...userData,
//         shipping_state: value,
//         shipping_city: "",
//       });
//     } else {
//       setUserData({
//         ...userData,
//         [name]: value,
//       });
//     }
//   };

//   const handleCheckboxChange = (event) => {
//   setIsChecked(event.target.checked);

//   if (event.target.checked) {
//     const updatedUserData = {
//       ...userData,
//       shipping_address: userData.address,
//       shipping_pincode: userData.pincode,
//       shipping_state: userData.state,
//       shipping_city: userData.city,
//     };
    
//     setUserData(updatedUserData);
    
//     // Fetch shipping cities for the selected state
//     if (userData.state) {
//       fetchShippingCity(userData.state);
//     }
//   } else {
//     setUserData({
//       ...userData,
//       shipping_address: "",
//       shipping_pincode: "",
//       shipping_state: "",
//       shipping_city: "",
//     });
//   }
// };
//   // SUB TOTAL
//   const SubAmount = () => {
//     let subTotal = 0;
//     Items?.forEach((data) => {
//       const Pricekey = "total_amount_" + data.gold_type;
//       const price = parseFloat(data[Pricekey]);
//       subTotal += price;
//     });
//     return subTotal;
//   };

//   // GST TOTAL
//   const SubGST = () => {
//     let subGst = 0;
//     Items?.forEach((data) => {
//       const Pricekey = "total_amount_" + data.gold_type;
//       const price = parseFloat(data[Pricekey]);
//       subGst += price;
//     });
//     const gstAmount = subGst * 0.03;
//     return gstAmount;
//   };

//   const SubTotal = () => {
//     let subTotal = 0;
//     Items?.forEach((data) => {
//       const Pricekey = "metal_value_" + data.gold_type;
//       const price = parseFloat(data[Pricekey]);
//       subTotal += price;
//     });
//     return subTotal;
//   };

//   const SubCharge = () => {
//     let subCharge = 0;
//     Items?.forEach((data) => {
//       const czStoneCharge = parseFloat(data.cz_stone_charge) || 0;
//       const gemstoneCharge = parseFloat(data.gemstone_charge) || 0;
//       let finalmakingCharge = 0;

//       let making_charge = data["making_charge_" + data.gold_type];

//       let making_charge_discount =
//         data["making_charge_discount_" + data.gold_type];

//       if (making_charge_discount > 0) {
//         finalmakingCharge = making_charge_discount;
//       } else {
//         finalmakingCharge = making_charge;
//       }

//       const totalCharge = czStoneCharge + gemstoneCharge + finalmakingCharge;
//       subCharge += totalCharge;
//     });
//     return subCharge;
//   };

//   const goldColor = {
//     yellow_gold: "Yellow Gold",
//     rose_gold: "Rose Gold",
//     white_gold: "White Gold",
//   };

//   const pincodeRegex = /^\d{6}$/;

//   const isValidPan = (panNumber) => {
//     const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;

//     return panRegex.test(panNumber);
//   };

//   const totalPrice = code.discount_value
//     ? code.discount_type === "percentage"
//       ? SubTotal() + SubCharge() - (SubCharge() * code.discount_value) / 100
//       : SubTotal() + SubCharge() - code.discount_value
//     : SubTotal() + SubCharge();

//   const isPriceAboveLimit = totalPrice >= 200000;

//   const FormValidation = () => {
//     let isValid = true;
//     const validationErrors = { ...error };
//     if (!userData.name.trim()) {
//       validationErrors.nameErr = "Name is required";
//       isValid = false;
//     } else {
//       validationErrors.nameErr = "";
//     }

//     if (!userData.email.trim()) {
//       validationErrors.emailErr = "Email is required";
//       isValid = false;
//     } else if (
//       !/^[a-zA-Z\d\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/i.test(userData.email)
//     ) {
//       validationErrors.emailErr = "Invalid email address";
//       isValid = false;
//     } else if (userData.email.indexOf("@") === -1) {
//       validationErrors.emailErr = "Email address must contain @ symbol";
//       isValid = false;
//     } else {
//       validationErrors.emailErr = "";
//     }

//     if (isPriceAboveLimit && !userData.pan_no) {
//       setValid(
//         "Pancard is required for your total amount is more than 2 lakh or above"
//       );
//       isValid = false;
//     } else if (isPriceAboveLimit && !isValidPan(userData.pan_no)) {
//       setValid("Invalid pan-card Format");
//       isValid = false;
//     } else {
//       setValid("");
//     }

//     if (!userData.address.trim()) {
//       validationErrors.addressErr = "Address is required";
//       isValid = false;
//     } else {
//       validationErrors.addressErr = "";
//     }
//     if (!userData.pincode.trim()) {
//       validationErrors.pincodeErr = "Pincode is required";
//       isValid = false;
//     } else if (!pincodeRegex.test(userData.pincode.trim())) {
//       validationErrors.pincodeErr = "Pincode must be a 6-digit number";
//       isValid = false;
//     } else {
//       validationErrors.pincodeErr = "";
//     }

//     if (userData.state == "" || userData.state == undefined) {
//       validationErrors.stateErr = "State must be select";
//       isValid = false;
//     } else {
//       validationErrors.stateErr = "";
//     }
//     if (userData.city == "" || userData.city == undefined) {
//       validationErrors.cityErr = "City must be select";
//       isValid = false;
//     } else {
//       validationErrors.cityErr = "";
//     }

//     if (!isChecked) {
//       if (!isChecked && !userData.shipping_address.trim()) {
//         validationErrors.shipping_address_err = "Shipping Address is required";
//         isValid = false;
//       } else {
//         validationErrors.shipping_address_err = "";
//       }

//       if (!userData.shipping_pincode.trim()) {
//         validationErrors.shipping_pincode_err = "Shipping Pincode is required";
//         isValid = false;
//       } else if (!pincodeRegex.test(userData.shipping_pincode.trim())) {
//         validationErrors.shipping_pincode_err =
//           "Shipping Pincode must be a 6-digit number";
//         isValid = false;
//       } else {
//         validationErrors.shipping_pincode_err = "";
//       }

//       if (
//         userData.shipping_state == "" ||
//         userData.shipping_state == undefined
//       ) {
//         validationErrors.shipping_state_err = "shipping state must be select";
//         isValid = false;
//       } else {
//         validationErrors.shipping_state_err = "";
//       }
//       if (userData.shipping_city == "" || userData.shipping_city == undefined) {
//         validationErrors.shipping_city_err = "shipping city must be select";
//         isValid = false;
//       } else {
//         validationErrors.shipping_city_err = "";
//       }
//     } else {
//       validationErrors.shipping_address_err = "";
//       validationErrors.shipping_pincode_err = "";
//       validationErrors.shipping_state_err = "";
//       validationErrors.shipping_city_err = "";
//     }
//     setError(validationErrors);
//     return isValid;
//   };

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     const isFormValid = FormValidation();
//     if (isFormValid) {
//       setSpinner(true);
//       const formData = new FormData();
//       formData.append("id", selectedData.id);
//       formData.append("name", userData.name ? userData.name : "");
//       formData.append("email", userData.email ? userData.email : "");
//       formData.append("phone", userData.phone ? userData.phone : "");
//       formData.append("pan_no", userData.pan_no ? userData.pan_no : "");
//       formData.append("gst_no", userData.gst_no ? userData.gst_no : "");

//       // company address update
//       formData.append("address", userData.address ? userData.address : "");
//       formData.append("pincode", userData.pincode ? userData.pincode : "");
//       formData.append("state", userData.state ? userData.state : "");
//       formData.append("city", userData.city ? userData.city : "");

//       // checkbox update
//       formData.append("address_same_as_company", isChecked ? "1" : "0");

//       // shipping address update
//       formData.append(
//         "shipping_address",
//         isChecked ? userData.address : userData.shipping_address
//       );
//       formData.append(
//         "shipping_pincode",
//         isChecked ? userData.pincode : userData.shipping_pincode
//       );
//       formData.append(
//         "shipping_state",
//         isChecked ? userData.state : userData.shipping_state
//       );
//       formData.append(
//         "shipping_city",
//         isChecked ? userData.city : userData.shipping_city
//       );

//       profileService
//         .updateProfile(formData)
//         .then((res) => {
//           if (res.status === true) {
//             setShowEdit(false);
//             getProfile();
//             profilename({
//               type: "SET_NAME",
//               payload: { profilename: !namestate?.profilename },
//             });
//             toast.success(res.message);
//             localStorage.setItem("verification", res.data.verification);
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//         })
//         .finally(() => {
//           setSpinner(false);
//         });
//     } else {
//     }
//   };

//   useEffect(() => {
//     const validationErrors = {
//       shipping_address_err: "",
//       shipping_state_err: "",
//       shipping_city_err: "",
//       shipping_pincode_err: "",
//     };

//     if (!isChecked) {
//       if (!userData.shipping_address.trim()) {
//         validationErrors.shipping_address_err = "Shipping address is required";
//       }
//       if (!userData.shipping_pincode.trim()) {
//         validationErrors.shipping_pincode_err = "Shipping pincode is required";
//       }
//       if (!userData.shipping_state || userData.shipping_state === undefined) {
//         validationErrors.shipping_state_err = "Shipping state must be select";
//       }
//       if (!userData.shipping_city || userData.shipping_city === undefined) {
//         validationErrors.shipping_city_err = "Shipping city must be select";
//       }
//     } else {
//       validationErrors.shipping_address_err = "";
//       validationErrors.shipping_state_err = "";
//       validationErrors.shipping_city_err = "";
//       validationErrors.shipping_pincode_err = "";
//     }

//     setError(validationErrors);
//   }, [isChecked, userData]);

//   useEffect(() => {
//     setIsChecked(profileData?.address_same_as_company === 1);
//   }, [profileData?.address_same_as_company]);

//   // cart all functiolity
//   const UserCartItems = async () => {
//     UserService.CartList({ phone: Phone })
//       .then((res) => {
//         setItems(res?.data?.cart_items);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         console.log(err);
//         setIsLoading(false);
//       });
//   };

//   const handleDealercode = (e) => {
//     setDealer_Code(e.target.value);
//   };

//   const calculateTotal = () => {
//     const subTotal = SubTotal();
//     const subCharge = SubCharge();
//     const newTotal = subTotal + subCharge;

//     setTotal(newTotal); // update total state
//   };

//   const removeCoupon = () => {
//     toast.success("Coupon has been removed");
//     setDealer_Code("");
//     setMessage(false);
//     setShow(false);
//     localStorage.removeItem("savedDiscount");
//     localStorage.removeItem("message");
//     setCode({ discount_type: "", discount_value: 0 });
//     calculateTotal();
//   };

//   useEffect(() => {
//     const savedDiscount = localStorage.getItem("savedDiscount");
//     if (savedDiscount) {
//       setCode(JSON.parse(savedDiscount));
//       setShow(true);
//     }
//   }, []);

//   useEffect(() => {
//     const storedMessage = localStorage.getItem("message");
//     if (storedMessage) {
//       setMessage(JSON.parse(storedMessage));
//     }
//   }, []);

//   useEffect(() => {
//     UserCartItems();
//     getProfile();
//   }, []);

//   const Applycoupen = (e) => {
//     e.preventDefault();
//     UserService.DealerCode({ phone: Phone, dealer_code: dealer_code })
//       .then((res) => {
//         if (res.status === false) {
//           setIsFormEmpty(res.message);
//           setShow(false);
//           setDealer_Code("");
//         } else {
//           localStorage.setItem("savedDiscount", JSON.stringify(res.data));
//           setShow(true);
//           setCode(res.data);
//           setMessage(true);
//           localStorage.setItem("message", JSON.stringify(true));
//           setIsFormEmpty("");
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const Remove = (id) => {
//     setRemovingItemId(id);
//     const payload = id;
//     UserService.RemovetoCart({ cart_id: id })
//       .then((res) => {
//         if (res.status === true) {
//           UserCartItems();
//           removefromcartDispatch({
//             type: "REMOVE_FROM_CART",
//             payload,
//           });
//           toast.success("remove design from cart successfully");
//           if (res?.data?.total_quantity == 0) {
//             localStorage.removeItem("savedDiscount");
//             localStorage.removeItem("message");
//           }
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       })
//       .finally(() => {
//         setRemovingItemId(null);
//       });
//   };

//   // TOTAL PRICE
//   let overAllAmount = SubTotal() + SubCharge() + SubGST();

//   if (code?.discount_value) {
//     if (code?.discount_type === "percentage") {
//       overAllAmount =
//         overAllAmount - (SubCharge() * code?.discount_value) / 100;
//     } else {
//       overAllAmount = overAllAmount - code?.discount_value;
//     }
//   }
//   const advanceAmount = ((overAllAmount * 20) / 100).toFixed();

//   useEffect(() => {
//     calculateTotal();
//   }, [Items, code]);

//   const removeCouping = <Tooltip id="tooltip">Remove Coupon</Tooltip>;

//   // Advance Payment Click Function Here advanceAmount
//   const handlePhonepeClick = () => {
//     if (Verification == 2) {
//       if (overAllAmount >= 200000 && !userData?.pan_no) {
//         setValid(
//           "Pancard is required for your total amount is more than 2 lakh or above"
//         );
//         setShowEdit(true);
//         setSpinner(false);
//       } else if (overAllAmount < 200000) {
//         UserService.PayByPhonepeAPI({
//           user_id: user_id,
//           total_amount: advanceAmount,
//         })
//           .then((res) => {
//             if (res?.success === false) {
//               setSpinner(false);
//               toast.error(res?.message);
//             } else {
//               setSpinner(false);
//               window.location.href =
//                 res?.data?.instrumentResponse?.redirectInfo?.url;
//             }
//           })
//           .catch((err) => {
//             console.log(err);
//             setSpinner(false);
//           });
//       } else {
//         UserService.PayByPhonepeAPI({
//           user_id: user_id,
//           total_amount: advanceAmount,
//         })
//           .then((res) => {
//             if (res?.success === false) {
//               setSpinner(false);
//               toast.error(res?.message);
//             } else {
//               setSpinner(false);
//               window.location.href =
//                 res?.data?.instrumentResponse?.redirectInfo?.url;
//             }
//           })
//           .catch((err) => {
//             console.log(err);
//             setSpinner(false);
//           });
//       }
//     } else {
//       setShowEdit(true);
//       setSpinner(false);
//     }
//   };

//   const numberFormat = (value) =>
//     new Intl.NumberFormat("en-IN")?.format(Math?.round(value));

//   useEffect(() => {
//     if (location.pathname === "/processing-order") {
//       const queryParams = new URLSearchParams(location.search);
//       const transaction_id = queryParams.get("transaction_id") || "";
//       const advanceplus = overAllAmount - advanceAmount;

//       let totalNetWeight = 0;
//       let totalGrossWeight = 0;

//       Items.forEach((item) => {
//         if (item.gold_type === "14k") {
//           totalNetWeight += item.net_weight_14k;
//         } else if (item.gold_type === "18k") {
//           totalNetWeight += item.net_weight_18k;
//         } else if (item.gold_type === "20k") {
//           totalNetWeight += item.net_weight_20k;
//         } else if (item.gold_type === "22k") {
//           totalNetWeight += item.net_weight_22k;
//         }
//       });

//       Items.forEach((item) => {
//         if (item.gold_type === "14k") {
//           totalGrossWeight += item.gross_weight_14k;
//         } else if (item.gold_type === "18k") {
//           totalGrossWeight += item.gross_weight_18k;
//         } else if (item.gold_type === "20k") {
//           totalGrossWeight += item.gross_weight_20k;
//         } else if (item.gold_type === "22k") {
//           totalGrossWeight += item.gross_weight_22k;
//         }
//       });

//       UserService.ShipmentCreate({
//         consignee_name: profileData?.name,
//         address_line1: profileData?.shipping_address,
//         address_line2:
//           profileData?.shipping_city_name +
//           "," +
//           profileData?.shipping_state_name,
//         pinCode: profileData?.shipping_pincode,
//         auth_receiver_name: profileData?.name,
//         auth_receiver_phone: profileData?.phone?.replace("+91", ""),
//         net_weight: totalNetWeight.toString(),
//         gross_weight: totalGrossWeight.toString(),
//         net_value: overAllAmount?.toString(),
//         codValue: advanceplus?.toString(),
//         no_of_packages: "1",
//         boxes: [
//           {
//             box_number: "",
//             lock_number: "",
//             length: "",
//             breadth: "",
//             height: "",
//             gross_weight: "",
//           },
//         ],
//       })
//         .then((res) => {
//           if (res?.status == "true" && res?.data?.docket_number) {
//             const docketNumber = res.data.docket_number;
//             setDocket_Number(docketNumber);
//             if (Items.length > 0) {
//               axios
//                 .post(api + "user/purchase-order", {
//                   user_id: user_id,
//                   dealer_code: code?.dealer_code || "",
//                   dealer_discount_type: code?.discount_type || "",
//                   dealer_discount_value: code?.discount_value || "",
//                   cart_items: Items.map((item) => item.id),
//                   sub_total: SubTotal() || 0,
//                   charges: SubCharge() || 0,
//                   gst_amount: SubGST().toFixed() || 0,
//                   total: overAllAmount.toFixed(),
//                   transaction_id: transaction_id ? transaction_id : "",
//                   docate_number: docketNumber ? docketNumber : "",
//                   pending_cash: advanceplus?.toString()
//                     ? advanceplus?.toString()
//                     : "",
//                 })
//                 .then((res) => {
//                   if (res?.data?.status === true) {
//                     resetcartcount({ type: "RESET_CART" });
//                     toast.success(res.data.message);
//                     localStorage.removeItem("savedDiscount");
//                     localStorage.removeItem("cartItems");
//                     localStorage.removeItem("message");
//                     setTimeout(() => {
//                       navigate(`/order-details/${res?.data?.data}`);
//                     }, 2000);
//                   } else {
//                     toast.error(res.data.message);
//                     navigate("/");
//                   }
//                   setIsLoading(false);
//                 })
//                 .catch((error) => {
//                   console.log(error);
//                   setIsLoading(false);
//                 });
//             }
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, [location.pathname, location.search, Items]);

//   const handleClose = () => {
//     setShowEdit(false);
//   };
// const DiscountAmount = () => {
//   if (code?.discount_value) {
//     if (code?.discount_type === "percentage") {
//       return (SubCharge() * code.discount_value) / 100;
//     } else {
//       return code.discount_value;
//     }
//   }
//   return 0;
// };
// const SubTotalAfterDiscount = () => {
//   return SubAmount() - DiscountAmount();
// };
//   return (
//     <>
//       <Helmet>
//         <title>Impel Store - Cart</title>
//       </Helmet>

//       {location.pathname === "/processing-order" ? (
//         <Loader />
//       ) : (
//         <>
//           <section className="cart">
//             <div>
//               <div className="container">
//                 {isLoading ? (
//                   <>
//                   <Loader />
//                   </>
//                 ) : (
//                   <>
//                     {Items?.length ? (
//                       <>
//                         <div className="row">
//                           <div className="col-md-9">
//                             <div className="card border shadow-0">
//                               <div className="m-4">
//                                 <h4 className="card-title mb-4">
//                                   Your shopping cart
//                                 </h4>
//                                 <div className="row gy-3">
//                                   <>
//                                     <div className="col-md-12">
//                                       <hr className="mt-0" />
//                                     </div>
//                                     {Items?.map((data, index) => {
//                                       return (
//                                         <>
//                                           <div className="col-md-3" key={index}>
//                                             <div className="d-flex">
//                                               <Link
//                                                 to={`/shopdetails/${data.design_id}`}
//                                                 className="nav-link"
//                                               >
//                                                 <img
//                                                   src={data.image}
//                                                   className="border rounded me-3 w-100 p-2"
//                                                   alt=""
//                                                 />
//                                               </Link>
//                                             </div>
//                                           </div>
//                                           <div className="col-md-4">
//                                             <div className="cart_product_name">
//                                               <Link
//                                                 to={`/shopdetails/${data.design_id}`}
//                                                 className="nav-link"
//                                               >
//                                                 {data?.design_name}
//                                               </Link>
//                                             </div>

//                                             <div className="mt-md-2">
//                                               <span>
//                                                 Gold Color : &nbsp;
//                                                 <b>
//                                                   {goldColor[data.gold_color]}{" "}
//                                                   &nbsp;
//                                                   {data.gold_type}
//                                                 </b>
//                                               </span>
//                                             </div>

//                                             <div className="mt-3">
//                                               {data.gold_type == "22k" && (
//                                                 <h6>
//                                                   ₹
//                                                   {numberFormat(
//                                                     data?.total_amount_22k
//                                                   )}
//                                                 </h6>
//                                               )}

//                                               {data.gold_type == "20k" && (
//                                                 <h6>
//                                                   ₹
//                                                   {numberFormat(
//                                                     data?.total_amount_20k
//                                                   )}
//                                                 </h6>
//                                               )}

//                                               {data.gold_type == "18k" && (
//                                                 <h6>
//                                                   ₹
//                                                   {numberFormat(
//                                                     data?.total_amount_18k
//                                                   )}
//                                                 </h6>
//                                               )}

//                                               {data.gold_type == "14k" && (
//                                                 <h6>
//                                                   ₹
//                                                   {numberFormat(
//                                                     data?.total_amount_14k
//                                                   )}
//                                                 </h6>
//                                               )}
//                                             </div>
//                                           </div>

//                                           <div className="col-md-5">
//                                             <div className="text-md-end">
//                                               <Link
//                                                 to="#"
//                                                 className="btn btn-light border text-danger icon-hover-danger text-end"
//                                                 onClick={() => Remove(data.id)}
//                                               >
//                                                 {removingItemId === data.id && (
//                                                   <CgSpinner
//                                                     size={20}
//                                                     className="animate_spin"
//                                                   />
//                                                 )}
//                                                 {removingItemId === data.id ? (
//                                                   ""
//                                                 ) : (
//                                                   <MdDelete />
//                                                 )}
//                                               </Link>
//                                             </div>
//                                           </div>
//                                           <div className="col-md-12">
//                                             <hr className="mt-0" />
//                                           </div>
//                                         </>
//                                       );
//                                     })}
//                                   </>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="col-lg-3 mt-3 mt-md-0">
//                             {!show && (
//                               <div className="card mb-3 border shadow-0">
//                                 <div className="card-body">
//                                   <form>
//                                     <div className="form-group">
//                                       <label className="form-label">
//                                         Have a Dealer coupon?
//                                       </label>
//                                       <div className="input-group">
//                                         <input
//                                           type="text"
//                                           name="dealer_code"
//                                           className="form-control border"
//                                           placeholder="Dealer coupon code"
//                                           value={dealer_code}
//                                           onChange={(e) => handleDealercode(e)}
//                                         />
//                                         <button
//                                           className="btn btn-light border"
//                                           onClick={(e) => Applycoupen(e)}
//                                         >
//                                           Apply
//                                         </button>
//                                       </div>
//                                       {isFormEmpty ? (
//                                         <span className="text-danger">
//                                           {isFormEmpty}
//                                         </span>
//                                       ) : (
//                                         <></>
//                                       )}
//                                     </div>
//                                   </form>
//                                 </div>
//                               </div>
//                             )}
//                             <div className="card shadow-0 border">
//                               <div className="card-body">
//                                 {/* SUB TOTAL :*/}
//                               <div className="d-flex justify-content-between">
//       <p className="mb-2">Price :</p>
//       <p className="mb-2 fw-bold">
//         ₹{numberFormat(SubAmount())}
//       </p>
//     </div>
//                                 <hr />
//   {message && code?.discount_value && (
//       <>
//         <div className="d-flex justify-content-between">
//           <p className="mb-2 text-success">Discount :</p>
//           <p className="mb-2 fw-bold text-success">
//             - ₹{numberFormat(DiscountAmount())}
//           </p>
//         </div>
//         <hr />
        
//         {/* SUBTOTAL AFTER DISCOUNT */}
//         <div className="d-flex justify-content-between">
//           <p className="mb-2">Subtotal  :</p>
//           <p className="mb-2 fw-bold">
//             ₹{numberFormat(SubTotalAfterDiscount())}
//           </p>
//         </div>
//         <hr />
//       </>
//     )}
//                                 {/* GST TOTAL :*/}
//                                 <div className="d-flex justify-content-between">
//                                   <p className="mb-2">GST (3%)</p>
//                                   <p className="mb-2 fw-bold">
//                                     ₹{numberFormat(SubGST()?.toFixed())}
//                                   </p>
//                                 </div>
//                                 <hr />

//                                 {/* TOTAL PRICE :*/}
//                                 <div className="d-flex justify-content-between">
//                                   <p className="mb-2">Total price :</p>
//                                   <div>
//                                     {message ? (
//                                       <>
//                                         <del className="text-danger me-2">
//                                           ₹
//                                           {numberFormat(
//                                             SubTotal() + SubCharge() + SubGST()
//                                           )}
//                                         </del>
//                                         <span className="fw-bold text-success">
//                                           ₹{numberFormat(overAllAmount)}
//                                         </span>
//                                       </>
//                                     ) : (
//                                       <>
//                                         <p className="mb-2 fw-bold">
//                                           {code?.discount_value ? (
//                                             <>
//                                               ₹
//                                               {code?.discount_type ===
//                                               "percentage"
//                                                 ? numberFormat(overAllAmount)
//                                                 : numberFormat(overAllAmount)}
//                                             </>
//                                           ) : (
//                                             <>₹{numberFormat(overAllAmount)}</>
//                                           )}
//                                         </p>
//                                       </>
//                                     )}
//                                   </div>
//                                 </div>
//                                 <hr />

                               

//                                 {message && (
//                                   <div className="message-box mb-3">
//                                     <div className="text-end">
//                                       <OverlayTrigger
//                                         placement="top"
//                                         overlay={removeCouping}
//                                       >
//                                         <Link className="icon" to="#">
//                                           <IoIosCloseCircleOutline
//                                             onClick={removeCoupon}
//                                             style={{
//                                               color: "#ff0000",
//                                               fontSize: "25px",
//                                               cursor: "pointer",
//                                             }}
//                                           />
//                                         </Link>
//                                       </OverlayTrigger>
//                                     </div>
//                                     <span>
//                                       You are now eligible for a base
//                                       discount&nbsp;
//                                       <b>
//                                         {code.discount_type === "percentage" ? (
//                                           <>({code.discount_value}%)</>
//                                         ) : (
//                                           <>₹({code.discount_value})</>
//                                         )}
//                                       </b>
//                                       &nbsp;off on making charges.
//                                     </span>
//                                   </div>
//                                 )}
//                                 {/* <div>
//                                   <button onClick={() => tester()}>
//                                     Click me
//                                   </button>
//                                 </div> */}
//                                 <div>
//                                   {/* <form onSubmit={ApplyPincode}>
//                                     <div className="form-group">
//                                       <div className="input-group">
//                                         <input
//                                           type="number"
//                                           name="pin_code"
//                                           className="form-control border"
//                                           placeholder="Enter pincode"
//                                           value={pin_code}
//                                           onChange={(e) => handlePincode(e)}
//                                           required
//                                           min="100000"
//                                           max="999999"
//                                           pattern="^\d{6}$"
//                                           title="Please enter a valid 6-digit pin code"
//                                         />

//                                         {pin_code_loader ? (
//                                           <>
//                                             <Spin
//                                               indicator={
//                                                 <LoadingOutlined
//                                                   spin
//                                                   style={{ margin: "10px" }}
//                                                 />
//                                               }
//                                             />
//                                           </>
//                                         ) : (
//                                           <>
//                                             <button
//                                               type="submit"
//                                               className="btn btn-light border"
//                                             >
//                                               Check
//                                             </button>
//                                           </>
//                                         )}
//                                       </div>
//                                       {pin_code_err && (
//                                         <span className="text-success fw-bold">
//                                           {pin_code_err}
//                                         </span>
//                                       )}
//                                       {pin_code_msg && (
//                                         <span className="text-danger fw-bold">
//                                           {pin_code_msg}
//                                         </span>
//                                       )}
//                                     </div>
//                                   </form> */}
//                                 </div>

//                                   <>
//                                     <div className="pt-2">
//                                       <button
//                                         className="btn btn-success w-100 shadow-0 mb-2"
//                                         disabled={spinner}
//                                         onClick={(e) => {
//                                           handlePhonepeClick();
//                                           handleProfileData(profileData);
//                                         }}
//                                       >
//                                         {spinner && (
//                                           <CgSpinner
//                                             size={20}
//                                             className="animate_spin me-2"
//                                           />
//                                         )}
//                                         Minimum Advance Payable Amount (₹
//                                         {numberFormat(advanceAmount)})
//                                       </button>
//                                       <button
//                                         type="button"
//                                         className="light-up-button w-100 rounded-2"
//                                         onClick={() => navigate("/shop")}
//                                       >
//                                         Back to shop
//                                       </button>
//                                     </div>
//                                   </>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </>
//                     ) : (
//                       <>
//                         <div className="row justify-content-center">
//                           <div className="col-lg-8">
//                             <div className="card border shadow-sm p-4">
//                               <div className="text-center mb-4">
//                                 <h2 className="card-title mb-0">
//                                   Your Shopping Cart
//                                 </h2>
//                               </div>

//                               <div className="text-center my-4">
//                                 <img
//                                   src={emptycart}
//                                   alt="Empty Cart Illustration"
//                                   className="img-fluid mb-3"
//                                   style={{ maxWidth: "200px" }}
//                                 />
//                                 <h5 className="text-muted mb-3">
//                                   Oops! Your cart is empty.
//                                 </h5>
//                                 <p className="text-muted">
//                                   Explore our collection and add items to your
//                                   cart.
//                                 </p>
//                               </div>

//                               <div className="text-center">
//                                 <Link
//                                   to="/shop"
//                                   className="view_all_btn px-4 py-2"
//                                   style={{ borderRadius: "8px" }}
//                                 >
//                                   <FaLongArrowAltLeft className="mr-2" />{" "}
//                                   &nbsp;Back to Shop
//                                 </Link>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </>
//                     )}
//                   </>
//                 )}

//                 <Modal
//                   className="form_intent profile_model"
//                   centered
//                   show={showEdit}
//                   backdrop="static"
//                   onHide={handleClose}
//                 >
//                   <Modal.Header closeButton>
//                     <Modal.Title>Edit Profile</Modal.Title>
//                   </Modal.Header>

//                   <Modal.Body>
//                     <Form
//                       onSubmit={(e) => handleUpdateProfile(e, selectedData)}
//                     >
//                       <div className="row edit-user-form">
//                         <div className="col-md-6">
//                           <Form.Group
//                             as={Col}
//                             className="mb-2"
//                             controlId="formGridState"
//                           >
//                             <Form.Label>
//                               Name
//                               <span className="text-danger">
//                                 <b>*</b>
//                               </span>
//                             </Form.Label>
//                             <Form.Control
//                               name="name"
//                               defaultValue={selectedData.name}
//                               onChange={(e) => handleChange(e)}
//                               placeholder="Enter Your Name"
//                             />
//                             {error.nameErr && (
//                               <span className="text-danger">
//                                 {error.nameErr}
//                               </span>
//                             )}
//                           </Form.Group>
//                         </div>
//                         <div className="col-md-6">
//                           <Form.Group
//                             as={Col}
//                             className="mb-2"
//                             controlId="formGridState"
//                           >
//                             <Form.Label>
//                               Email<span className="text-danger">*</span>
//                             </Form.Label>
//                             <Form.Control
//                               name="email"
//                               defaultValue={selectedData.email}
//                               onChange={(e) => handleChange(e)}
//                               placeholder="Enter Your Email"
//                             />
//                             <span className="text-danger">
//                               {error.emailErr}
//                             </span>
//                           </Form.Group>
//                         </div>
//                         <div className="col-md-6">
//                           <Form.Group
//                             as={Col}
//                             className="mb-2"
//                             controlId="formGridState"
//                           >
//                             <Form.Label>Phone</Form.Label>
//                             <Form.Control
//                               defaultValue={profileData?.phone?.replace(
//                                 "+91",
//                                 ""
//                               )}
//                               disabled
//                             />
//                           </Form.Group>
//                         </div>

//                         <div className="col-md-6 mb-3">
//                           <Form.Group
//                             className="mb-2"
//                             controlId="formGridAddress1"
//                           >
//                             <Form.Label>
//                               Pan-card
//                               {valid ? (
//                                 <span className="text-danger">*</span>
//                               ) : (
//                                 ""
//                               )}
//                             </Form.Label>
//                             <Form.Control
//                               name="pan_no"
//                               defaultValue={selectedData.pan_no}
//                               onChange={(e) => handleChange(e)}
//                               placeholder="Enter Your Pancard number"
//                             />
//                             {valid && (
//                               <span className="text-danger">{valid}</span>
//                             )}
//                           </Form.Group>
//                         </div>

//                         <div className="col-md-12">
//                           <hr className="mt-0" />
//                         </div>
//                         <div className="col-md-6">
//                           <Form.Group
//                             as={Col}
//                             className="mb-2"
//                             controlId="formGridZip"
//                           >
//                             <Form.Label>
//                               Billing Address
//                               <span className="text-danger">*</span>
//                             </Form.Label>
//                             <textarea
//                               name="address"
//                               className="form-control"
//                               defaultValue={selectedData.address}
//                               rows={4}
//                               style={{ resize: "none", height: "auto" }}
//                               onChange={(e) => {
//                                 handleChange(e);
//                               }}
//                               placeholder="Enter Your Address"
//                             />
//                             {error.addressErr && (
//                               <span className="text-danger">
//                                 {error.addressErr}
//                               </span>
//                             )}
//                           </Form.Group>
//                         </div>
//                         <div className="col-md-6">
//                           <Form.Group
//                             className="mb-2"
//                             controlId="formGridAddress1"
//                           >
//                             <Form.Label>
//                               State<span className="text-danger">*</span>
//                             </Form.Label>
//                             <select
//                               className="form-control"
//                               name="state"
//                               onChange={(e) => {
//                                 handleChange(e);
//                                 fetchCity(e.target.value);
//                               }}
//                               value={userData.state}
//                             >
//                               <option value="">--state select--</option>
//                               {profileData?.states?.map((userstate, index) => (
//                                 <option key={index} value={userstate.id}>
//                                   {userstate.name}
//                                 </option>
//                               ))}
//                             </select>
//                             <span className="text-danger">
//                               {error.stateErr}
//                             </span>
//                           </Form.Group>
//                         </div>
//                         <div className="col-md-6">
//                           <Form.Group
//                             className="mb-2"
//                             controlId="formGridAddress1"
//                           >
//                             <Form.Label>
//                               City<span className="text-danger">*</span>
//                             </Form.Label>
//                             <select
//                               className="form-control"
//                               name="city"
//                               onChange={(e) => {
//                                 handleChange(e);
//                               }}
//                               value={userData.city}
//                             >
//                               <option value="">--city select--</option>
//                               {city?.map((usercity, index) => (
//                                 <option key={index} value={usercity?.id}>
//                                   {usercity?.name}
//                                 </option>
//                               ))}
//                             </select>
//                             <span className="text-danger">{error.cityErr}</span>
//                           </Form.Group>
//                         </div>
//                         <div className="col-md-6 mb-3">
//                           <Form.Group
//                             className="mb-2"
//                             controlId="formGridAddress1"
//                           >
//                             <Form.Label>
//                               Pincode<span className="text-danger">*</span>
//                             </Form.Label>
//                             <Form.Control
//                               name="pincode"
//                               defaultValue={selectedData.pincode}
//                               onChange={(e) => handleChange(e)}
//                               placeholder="Enter Your Pincode"
//                               maxLength={6}
//                             />
//                             <span className="text-danger">
//                               {error.pincodeErr}
//                             </span>
//                           </Form.Group>
//                         </div>
//                         <div className="address-checkbox-btn">
//                           <input
//                             type="checkbox"
//                             id="checkbox"
//                             name="address_same_as_company"
//                             className="address-checkbox"
//                             checked={isChecked}
//                             onChange={handleCheckboxChange}
//                             style={{ cursor: "pointer" }}
//                           />
//                           <label
//                             htmlFor="checkbox"
//                             className="ms-1 address-check-text"
//                             style={{ cursor: "pointer" }}
//                           >
//                             Shipping Address is as same above then check this
//                             box
//                           </label>
//                         </div>
//                         <div className="col-md-12">
//                           <hr className="mt-3" />
//                         </div>
//                         <div className="col-md-6">
//                           <Form.Group
//                             as={Col}
//                             className="mb-2"
//                             controlId="formGridZip"
//                           >
//                             <Form.Label>
//                               Shipping Address
//                               <span className="text-danger">*</span>
//                             </Form.Label>
//                             <textarea
//                               name="shipping_address"
//                               className="form-control"
//                               value={userData.shipping_address}
//                               rows={4}
//                               style={{ resize: "none", height: "auto" }}
//                               onChange={(e) => {
//                                 handleChange(e);
//                               }}
//                               placeholder="Enter Your Address"
//                             />
//                             <span className="text-danger">
//                               {error.shipping_address_err}
//                             </span>
//                           </Form.Group>
//                         </div>
//                         <div className="col-md-6">
//                           <Form.Group
//                             className="mb-2"
//                             controlId="formGridAddress1"
//                           >
//                             <Form.Label>
//                               Shipping State
//                               <span className="text-danger">*</span>
//                             </Form.Label>
//                             <select
//                               className="form-control"
//                               name="shipping_state"
//                               onChange={(e) => {
//                                 handleChange(e);
//                                 fetchShippingCity(e.target.value);
//                               }}
//                               value={userData.shipping_state}
//                             >
//                               <option value="">
//                                 --shipping state select--
//                               </option>
//                               {profileData?.states?.map((userstate, index) => (
//                                 <option key={index} value={userstate.id}>
//                                   {userstate.name}
//                                 </option>
//                               ))}
//                             </select>
//                             <span className="text-danger">
//                               {error.shipping_state_err}
//                             </span>
//                           </Form.Group>
//                         </div>
//                         <div className="col-md-6">
//                           <Form.Group
//                             className="mb-2"
//                             controlId="formGridAddress1"
//                           >
//                             <Form.Label>
//                               Shipping City
//                               <span className="text-danger">*</span>
//                             </Form.Label>
//                            <select
//   className="form-control"
//   name="shipping_city"
//   onChange={(e) => {
//     handleChange(e);
//   }}
//   value={userData.shipping_city} 
// >
//   <option value="">--shipping City select--</option>
//   {shipping_city?.map((usercity, index) => (
//     <option key={index} value={usercity?.id}> 
//       {usercity?.name}
//     </option>
//   ))}
// </select>
//                             <span className="text-danger">
//                               {error.shipping_city_err}
//                             </span>
//                           </Form.Group>
//                         </div>
//                         <div className="col-md-6 mb-3">
//                           <Form.Group
//                             className="mb-2"
//                             controlId="formGridAddress1"
//                           >
//                             <Form.Label>
//                               Shipping Pincode
//                               <span className="text-danger">*</span>
//                             </Form.Label>
//                             <Form.Control
//                               name="shipping_pincode"
//                               value={userData.shipping_pincode}
//                               onChange={(e) => handleChange(e)}
//                               placeholder="Enter Your Pincode"
//                               maxLength={6}
//                             />
//                             <span className="text-danger">
//                               {error.shipping_pincode_err}
//                             </span>
//                           </Form.Group>
//                         </div>
//                       </div>

//                       <div className="text-center">
//                         <button className="update_order_btn">
//                           {spinner && (
//                             <CgSpinner
//                               size={20}
//                               className="animate_spin mx-3"
//                             />
//                           )}
//                           {spinner ? "" : "Update"}
//                         </button>
//                       </div>
//                     </Form>
//                   </Modal.Body>
//                 </Modal>
//               </div>
//             </div>
//           </section>
//         </>
//       )}
//     </>
//   );
// };

// export default Cart;
