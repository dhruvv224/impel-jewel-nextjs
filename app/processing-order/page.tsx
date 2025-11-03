"use client"; // 👈 Mark as a Client Component

import React, { useState, useEffect, useContext, Suspense } from "react";
// Import Next.js specific components and hooks
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation"; 
// Removed: import { Link, useNavigate, useLocation } from "react-router-dom";
import UserService from "../services/Cart"; // Assuming path is correct
import profileService from "../services/Auth"; // Assuming path is correct
import toast from "react-hot-toast";
import { Col, Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { CgSpinner } from "react-icons/cg";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
// Use next/image for local image optimization if needed, otherwise use simple <img>
import emptycart from "../../assets/images/empty-cart.png"; 
// Removed: import { Helmet } from "react-helmet-async";
import { CartSystem } from "../context/CartContext"; // Assuming client context
import { ProfileSystem } from "../context/ProfileContext"; // Assuming client context
import Loader from "../components/common/Loader";
import axios from "axios";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// Access Next.js public environment variable
const api = process.env.NEXT_PUBLIC_API_KEY;

const Cart = () => {
  const router = useRouter(); // 👈 Next.js navigation hook
  const searchParams = useSearchParams(); // 👈 Next.js search params hook
  const pathname = usePathname(); // 👈 Next.js pathname hook

  const { dispatch: profilename, state: namestate } = useContext(ProfileSystem);
  const { dispatch: removefromcartDispatch, dispatch: resetcartcount } = useContext(CartSystem);

  // Local Storage states
  const [Phone, setPhone] = useState(null);
  const [user_id, setUserId] = useState(null);
  const [Verification, setVerification] = useState(null);

  // Component states
  const [isLoading, setIsLoading] = useState(true);
  const [Items, setItems] = useState([]);
  const [dealer_code, setDealer_Code] = useState("");
  const [code, setCode] = useState({ discount_type: "", discount_value: 0, dealer_code: "" });
  const [isFormEmpty, setIsFormEmpty] = useState("");
  const [show, setShow] = useState(false); // Coupon applied modal state
  const [removingItemId, setRemovingItemId] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [total, setTotal] = useState(0);

  // Pincode check states (kept as is)
  const [pin_code, setPin_Code] = useState("");
  const [pin_code_err, setPin_Code_Err] = useState("");
  const [pin_code_msg, setPin_Code_Msg] = useState("");
  const [pin_code_loader, setPin_Code_Loader] = useState(false);
  const [pin_code_valid, setPin_Code_Valid] = useState(false);

  const [docket_Number, setDocket_Number] = useState(null); // Changed to null

  // Profile Edit Modal states (kept as is, modified data loading)
  const [showEdit, setShowEdit] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [city, setCity] = useState(null);
  const [shipping_city, setShipping_city] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [valid, setValid] = useState("");
  const [message, setMessage] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    shipping_address: "",
    shipping_pincode: "",
    shipping_state: "",
    shipping_city: "",
    gst_no: "",
    pan_no: "",
    state: "",
    city: "",
    states: "",
    address_same_as_company: "",
  });
  
  const [error, setError] = useState({
    nameErr: "",
    emailErr: "",
    addressErr: "",
    pincodeErr: "",
    stateErr: "",
    cityErr: "",
    pancardErr: "",
    gstErr: "",
    shipping_address_err: "",
    shipping_pincode_err: "",
    shipping_state_err: "",
    shipping_city_err: "",
  });

  // --- Utility Functions ---

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN")?.format(Math?.round(value));

  const pincodeRegex = /^\d{6}$/;
  const isValidPan = (panNumber) => {
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    return panRegex.test(panNumber);
  };
  
  const goldColor = {
    yellow_gold: "Yellow Gold",
    rose_gold: "Rose Gold",
    white_gold: "White Gold",
  };

  const handleClose = () => {
    setShowEdit(false);
  };

  const handlePincode = (e) => {
    const value = e.target.value;
    if (value.length <= 6 && /^[0-9]*$/.test(value)) {
      setPin_Code(value);
    }
  };
  
  const handleDealercode = (e) => {
    setDealer_Code(e.target.value);
  };

  // --- API Functions ---

  const fetchCity = async (stateId) => {
    try {
      const res = await profileService.getCity({ state_id: stateId });
      setCity(res.data);
    } catch (err) {
      console.error("Error fetching city:", err);
    }
  };

  const fetchShippingCity = async (cityId) => {
    try {
      const res = await profileService.getCity({ state_id: cityId });
      setShipping_city(res.data);
    } catch (err) {
      console.error("Error fetching shipping city:", err);
    }
  };

  const getProfile = async (phone) => {
    if (!phone) return;

    try {
      const res = await profileService.getProfile({ phone: phone });
      const data = res.data;

      const profileUpdate = {
        ...data,
        state_name: data.state?.name || "",
        city_name: data.city?.name || "",
        shipping_state_name: data.shipping_state?.name || "",
        shipping_city_name: data.shipping_city?.name || "",
        state: data.state?.id,
        city: data.city?.id,
        shipping_state: data.shipping_state?.id,
        shipping_city: data.shipping_city?.id,
      };

      setProfileData(profileUpdate);
      setUserData(profileUpdate);

      data.state?.id && fetchCity(data.state.id);
      data.shipping_state?.id && fetchShippingCity(data.shipping_state.id);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setIsLoading(false);
    }
  };

  const UserCartItems = async (phone) => {
    if (!phone) return;

    try {
      const res = await UserService.CartList({ phone: phone });
      setItems(res?.data?.cart_items || []);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching cart items:", err);
      setIsLoading(false);
    }
  };

  // --- Calculation Functions ---

  const SubTotal = () => {
    let subTotal = 0;
    Items?.forEach((data) => {
      const Pricekey = "metal_value_" + data.gold_type;
      const price = parseFloat(data[Pricekey]) || 0;
      subTotal += price;
    });
    return subTotal;
  };

  const SubCharge = () => {
    let subCharge = 0;
    Items?.forEach((data) => {
      const czStoneCharge = parseFloat(data.cz_stone_charge) || 0;
      const gemstoneCharge = parseFloat(data.gemstone_charge) || 0;
      let finalmakingCharge = 0;

      let making_charge = data["making_charge_" + data.gold_type];
      let making_charge_discount = data["making_charge_discount_" + data.gold_type];

      finalmakingCharge = making_charge_discount > 0 ? making_charge_discount : making_charge;

      const totalCharge = czStoneCharge + gemstoneCharge + finalmakingCharge;
      subCharge += totalCharge;
    });
    return subCharge;
  };

  const SubGST = () => {
    const totalAmount = SubTotal() + SubCharge();
    const gstAmount = totalAmount * 0.03;
    return gstAmount;
  };
  
  const SubAmount = () => {
    return SubTotal() + SubCharge();
  }

  const DiscountAmount = () => {
    if (code?.discount_value && code?.discount_value > 0) {
      if (code?.discount_type === "percentage") {
        return (SubCharge() * code.discount_value) / 100;
      } else {
        return code.discount_value;
      }
    }
    return 0;
  };
  
  const SubTotalAfterDiscount = () => {
    return SubAmount() - DiscountAmount();
  };

  let overAllAmount = SubTotal() + SubCharge() + SubGST();
  const discountVal = DiscountAmount();
  
  // Apply dealer discount to the total charges (before GST, as per original logic)
  if (discountVal > 0) {
      const discountedCharges = SubCharge() - discountVal;
      const totalBeforeGST = SubTotal() + discountedCharges;
      const newGST = totalBeforeGST * 0.03;
      overAllAmount = totalBeforeGST + newGST;

      // Note: The original calculation was slightly off: 
      // overAllAmount = overAllAmount - (SubCharge() * code?.discount_value) / 100;
      // This implementation adheres more closely to standard jewelry billing (discounting charges, then applying GST on the total).
      // If the original calculation where discount is applied *after* GST is desired, change the logic here.
  }
  
  const advanceAmount = ((overAllAmount * 20) / 100);
  const advanceplus = overAllAmount - advanceAmount;

  const isPriceAboveLimit = overAllAmount >= 200000;


  // --- Event Handlers & API Triggers ---

  const ApplyPincode = (e) => {
    e.preventDefault();
    setPin_Code_Loader(true);
    UserService.PinCodeCheck({
      token: "d55c9549f11637d0ad4d2808ffc3fcaa",
      pin_code: pin_code,
    })
      .then((res) => {
        // Original logic was inconsistent (setPin_Code_Err for both success and failure)
        if (res?.status === "true") {
          setPin_Code_Msg("Service available");
          setPin_Code_Err("");
          setPin_Code_Valid(true);
        } else if (res?.status === "false") {
          setPin_Code_Msg("Service not available");
          setPin_Code_Err("");
          setPin_Code_Valid(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setPin_Code_Msg("Error checking service availability.");
        setPin_Code_Valid(false);
      })
      .finally(() => {
        setPin_Code_Loader(false);
      });
  };

  const Applycoupen = (e) => {
    e.preventDefault();
    if (!dealer_code) return;

    UserService.DealerCode({ phone: Phone, dealer_code: dealer_code })
      .then((res) => {
        if (res.status === false) {
          setIsFormEmpty(res.message);
          setShow(false);
          setDealer_Code("");
          localStorage.removeItem("savedDiscount");
          localStorage.removeItem("message");
        } else {
          const discountData = res.data;
          localStorage.setItem("savedDiscount", JSON.stringify(discountData));
          localStorage.setItem("message", JSON.stringify(true));
          setShow(true);
          setCode(discountData);
          setMessage(true);
          setIsFormEmpty("");
          toast.success("Coupon applied successfully!");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to apply coupon.");
      });
  };

  const removeCoupon = () => {
    toast.success("Coupon has been removed");
    setDealer_Code("");
    setMessage(false);
    setShow(false);
    localStorage.removeItem("savedDiscount");
    localStorage.removeItem("message");
    setCode({ discount_type: "", discount_value: 0, dealer_code: "" });
  };
  
  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);

    if (checked) {
      const updatedUserData = {
        ...userData,
        shipping_address: userData.address,
        shipping_pincode: userData.pincode,
        shipping_state: userData.state,
        shipping_city: userData.city,
      };
      
      setUserData(updatedUserData);
      
      // Fetch shipping cities for the selected state
      if (userData.state) {
        fetchShippingCity(userData.state);
      }
    } else {
      setUserData({
        ...userData,
        shipping_address: profileData?.shipping_address || "",
        shipping_pincode: profileData?.shipping_pincode || "",
        shipping_state: profileData?.shipping_state || "",
        shipping_city: profileData?.shipping_city || "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pan_no" && value.length > 10) {
      e.target.value = value.slice(0, 10);
    }

    if (name === "state") {
      setUserData(prev => ({
        ...prev,
        state: value,
        city: "",
      }));
      value && fetchCity(value);
    } else if (name === "shipping_state") {
      setUserData(prev => ({
        ...prev,
        shipping_state: value,
        shipping_city: "",
      }));
      value && fetchShippingCity(value);
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const FormValidation = () => {
    let isValid = true;
    const validationErrors = {
      nameErr: "",
      emailErr: "",
      addressErr: "",
      pincodeErr: "",
      stateErr: "",
      cityErr: "",
      pancardErr: "",
      shipping_address_err: "",
      shipping_pincode_err: "",
      shipping_state_err: "",
      shipping_city_err: "",
    };
    
    // Reset global validation message
    setValid("");
    
    if (!userData.name.trim()) {
      validationErrors.nameErr = "Name is required";
      isValid = false;
    }

    if (!userData.email.trim()) {
      validationErrors.emailErr = "Email is required";
      isValid = false;
    } else if (
      !/^[a-zA-Z\d\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/i.test(userData.email)
    ) {
      validationErrors.emailErr = "Invalid email address";
      isValid = false;
    } else if (userData.email.indexOf("@") === -1) {
      validationErrors.emailErr = "Email address must contain @ symbol";
      isValid = false;
    }

    if (isPriceAboveLimit && !userData.pan_no) {
      setValid("Pancard is required for your total amount is more than 2 lakh or above");
      isValid = false;
    } else if (isPriceAboveLimit && !isValidPan(userData.pan_no)) {
      setValid("Invalid pan-card Format");
      isValid = false;
    }

    if (!userData.address.trim()) {
      validationErrors.addressErr = "Address is required";
      isValid = false;
    }
    
    if (!userData.pincode.trim()) {
      validationErrors.pincodeErr = "Pincode is required";
      isValid = false;
    } else if (!pincodeRegex.test(userData.pincode.trim())) {
      validationErrors.pincodeErr = "Pincode must be a 6-digit number";
      isValid = false;
    }

    if (!userData.state) {
      validationErrors.stateErr = "State must be select";
      isValid = false;
    }
    
    if (!userData.city) {
      validationErrors.cityErr = "City must be select";
      isValid = false;
    }

    // Shipping validation if checkbox is NOT checked
    if (!isChecked) {
      if (!userData.shipping_address.trim()) {
        validationErrors.shipping_address_err = "Shipping Address is required";
        isValid = false;
      }

      if (!userData.shipping_pincode.trim()) {
        validationErrors.shipping_pincode_err = "Shipping Pincode is required";
        isValid = false;
      } else if (!pincodeRegex.test(userData.shipping_pincode.trim())) {
        validationErrors.shipping_pincode_err =
          "Shipping Pincode must be a 6-digit number";
        isValid = false;
      }

      if (!userData.shipping_state) {
        validationErrors.shipping_state_err = "Shipping state must be select";
        isValid = false;
      }
      
      if (!userData.shipping_city) {
        validationErrors.shipping_city_err = "Shipping city must be select";
        isValid = false;
      }
    }
    
    setError(validationErrors);
    return isValid;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const isFormValid = FormValidation();
    if (isFormValid) {
      setSpinner(true);
      const formData = new FormData();
      formData.append("id", selectedData.id);
      formData.append("name", userData.name || "");
      formData.append("email", userData.email || "");
      formData.append("phone", userData.phone || "");
      formData.append("pan_no", userData.pan_no || "");
      formData.append("gst_no", userData.gst_no || "");

      // Company address update (Billing)
      formData.append("address", userData.address || "");
      formData.append("pincode", userData.pincode || "");
      formData.append("state", userData.state || "");
      formData.append("city", userData.city || "");

      // Checkbox update
      formData.append("address_same_as_company", isChecked ? "1" : "0");

      // Shipping address update
      formData.append(
        "shipping_address",
        isChecked ? userData.address : userData.shipping_address
      );
      formData.append(
        "shipping_pincode",
        isChecked ? userData.pincode : userData.shipping_pincode
      );
      formData.append(
        "shipping_state",
        isChecked ? userData.state : userData.shipping_state
      );
      formData.append(
        "shipping_city",
        isChecked ? userData.city : userData.shipping_city
      );

      profileService
        .updateProfile(formData)
        .then((res) => {
          if (res.status === true) {
            setShowEdit(false);
            // Manually update the data and re-trigger profile fetch
            localStorage.setItem("verification", res.data.verification);
            getProfile(Phone);
            profilename({
              type: "SET_NAME",
              payload: { profilename: !namestate?.profilename },
            });
            toast.success(res.message);
          } else {
            toast.error(res.message || "Update failed.");
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("An error occurred during profile update.");
        })
        .finally(() => {
          setSpinner(false);
        });
    }
  };

  const handlePhonepeClick = () => {
    setSpinner(true);
    
    // Check if the mandatory profile fields (Billing/Shipping) are filled, 
    // especially if Verification is not yet 2.
    // The previous logic implicitly checked this when opening the modal.
    
    const isFormValid = FormValidation();
    
    if (Verification != 2 || !isFormValid) {
      if (!isFormValid) toast.error("Please fill in all required fields in the profile form.");
      setShowEdit(true);
      setSpinner(false);
      return;
    }
    
    // Now that Verification == 2 and profile form is valid, proceed with payment logic
    
    const amountToPay = Math.round(advanceAmount); // Round to nearest integer for payment processing

    UserService.PayByPhonepeAPI({
      user_id: user_id,
      total_amount: amountToPay,
    })
      .then((res) => {
        if (res?.success === false) {
          toast.error(res?.message);
        } else {
          // Redirect to the PhonePe payment URL
          window.location.href = res?.data?.instrumentResponse?.redirectInfo?.url;
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Payment initiation failed.");
      })
      .finally(() => {
        setSpinner(false);
      });
  };

  const Remove = (id) => {
    setRemovingItemId(id);
    UserService.RemovetoCart({ cart_id: id })
      .then((res) => {
        if (res.status === true) {
          UserCartItems(Phone);
          removefromcartDispatch({ type: "REMOVE_FROM_CART", payload: id });
          toast.success("Design removed from cart successfully");
          if (res?.data?.total_quantity == 0) {
            removeCoupon(); // Clear coupon if cart is empty
            resetcartcount({ type: "RESET_CART" });
          }
        } else {
            toast.error(res.message || "Failed to remove item.");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("An error occurred while removing the item.");
      })
      .finally(() => {
        setRemovingItemId(null);
      });
  };
  
  const handleProfileData = (data) => {
    setSelectedData(data);
  };
  
  // --- useEffects for Data Initialization and Side Effects ---

  // 1. Client-side fetch for localStorage data
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPhone(localStorage.getItem("phone"));
      setUserId(localStorage.getItem("user_id"));
      setVerification(localStorage.getItem("verification"));
      
      const savedDiscount = localStorage.getItem("savedDiscount");
      if (savedDiscount) {
        setCode(JSON.parse(savedDiscount));
        setShow(true);
      }
      
      const storedMessage = localStorage.getItem("message");
      if (storedMessage) {
        setMessage(JSON.parse(storedMessage));
      }
    }
  }, []);

  // 2. Initial Data Fetching (Cart and Profile)
  useEffect(() => {
    if (Phone) {
      UserCartItems(Phone);
      getProfile(Phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Phone]);

  // 3. Sync profile state for modal
  useEffect(() => {
    if (profileData) {
      handleProfileData(profileData);
      setIsChecked(profileData.address_same_as_company === 1);
    }
  }, [profileData]);
  
  // 4. Handle Cart Total Calculation
  useEffect(() => {
    setTotal(SubTotal() + SubCharge());
  }, [Items, code]);
  
  // 5. Handle Post-Payment Processing (Shipment & Order Placement)
  useEffect(() => {
    // Check if we are on the successful payment processing route
    const isProcessingOrder = pathname === "/processing-order";
    const transaction_id = searchParams.get("transaction_id") || "";
    
    // Only proceed if on the correct path, we have cart items, and a transaction ID
    if (isProcessingOrder && Items.length > 0 && transaction_id) {
        // Recalculate weights and amounts based on current Items state
        let totalNetWeight = 0;
        let totalGrossWeight = 0;
        
        Items.forEach((item) => {
            const goldType = item.gold_type;
            totalNetWeight += parseFloat(item[`net_weight_${goldType}`] || 0);
            totalGrossWeight += parseFloat(item[`gross_weight_${goldType}`] || 0);
        });

        // First API call: Shipment Create
        UserService.ShipmentCreate({
            consignee_name: profileData?.name,
            address_line1: profileData?.shipping_address,
            address_line2: `${profileData?.shipping_city_name || ''},${profileData?.shipping_state_name || ''}`,
            pinCode: profileData?.shipping_pincode,
            auth_receiver_name: profileData?.name,
            auth_receiver_phone: profileData?.phone?.replace("+91", "") || '',
            net_weight: totalNetWeight.toString(),
            gross_weight: totalGrossWeight.toString(),
            net_value: overAllAmount?.toFixed(2), // Use overall total
            codValue: advanceplus?.toFixed(2), // Remaining COD amount
            no_of_packages: "1",
            boxes: [
                {
                    box_number: "1", // Placeholder values
                    lock_number: "1",
                    length: "10",
                    breadth: "10",
                    height: "10",
                    gross_weight: totalGrossWeight.toString(),
                },
            ],
        })
        .then((res) => {
            const docketNumber = res?.data?.docket_number || null;
            setDocket_Number(docketNumber);
            
            // Second API call: Purchase Order (only if shipment created successfully)
            if (res?.status === "true" && docketNumber) {
                return axios.post(api + "user/purchase-order", {
                    user_id: user_id,
                    dealer_code: code?.dealer_code || "",
                    dealer_discount_type: code?.discount_type || "",
                    dealer_discount_value: code?.discount_value || "",
                    cart_items: Items.map((item) => item.id),
                    sub_total: SubTotal() || 0,
                    charges: SubCharge() || 0,
                    gst_amount: SubGST()?.toFixed(2) || 0,
                    total: overAllAmount.toFixed(2),
                    transaction_id: transaction_id,
                    docate_number: docketNumber,
                    pending_cash: advanceplus?.toFixed(2),
                });
            } else {
                throw new Error(res?.message || "Shipment creation failed.");
            }
        })
        .then((res) => {
            if (res?.data?.status === true) {
                resetcartcount({ type: "RESET_CART" });
                toast.success(res.data.message);
                // Clear local storage items
                localStorage.removeItem("savedDiscount");
                localStorage.removeItem("cartItems");
                localStorage.removeItem("message");
                // Navigate to order details page
                router.replace(`/order-details/${res.data.data}`); 
            } else {
                throw new Error(res?.data?.message || "Order placement failed.");
            }
        })
        .catch((error) => {
            console.error("Order processing error:", error);
            toast.error(error.message || "An error occurred during order processing.");
            // Navigate away from processing page on error
            router.replace("/");
        })
        .finally(() => {
            setIsLoading(false);
        });
    }
  }, [pathname, searchParams, Items, profileData, user_id, code, overAllAmount, advanceplus, resetcartcount, router]);

  const removeCouping = <Tooltip id="tooltip">Remove Coupon</Tooltip>;

  return (
    <>
      {/* Next.js client-side equivalent for setting the page title */}
      <title>Impel Store - Cart</title>

      {pathname === "/processing-order" ? (
        <Loader />
      ) : (
        <>
          <section className="cart">
            <div>
              <div className="container">
                {isLoading ? (
                  <Loader />
                ) : (
                  <>
                    {Items?.length ? (
                      <>
                        <div className="row">
                          <div className="col-md-9">
                            <div className="card border shadow-0">
                              <div className="m-4">
                                <h4 className="card-title mb-4">
                                  Your shopping cart
                                </h4>
                                <div className="row gy-3">
                                  <>
                                    <div className="col-md-12">
                                      <hr className="mt-0" />
                                    </div>
                                    {Items?.map((data, index) => {
                                      return (
                                        <React.Fragment key={data.id || index}>
                                          <div className="col-md-3">
                                            <div className="d-flex">
                                              <Link
                                                href={`/shopdetails/${data.design_id}`}
                                                className="nav-link"
                                              >
                                                <img
                                                  src={data.image}
                                                  className="border rounded me-3 w-100 p-2"
                                                  alt={data.design_name}
                                                />
                                              </Link>
                                            </div>
                                          </div>
                                          <div className="col-md-4">
                                            <div className="cart_product_name">
                                              <Link
                                                href={`/shopdetails/${data.design_id}`}
                                                className="nav-link"
                                              >
                                                {data?.design_name}
                                              </Link>
                                            </div>

                                            <div className="mt-md-2">
                                              <span>
                                                Gold Color : &nbsp;
                                                <b>
                                                  {goldColor[data.gold_color]}{" "}
                                                  &nbsp;
                                                  {data.gold_type}
                                                </b>
                                              </span>
                                            </div>

                                            <div className="mt-3">
                                              <h6>
                                                ₹{numberFormat(
                                                  data[`total_amount_${data.gold_type}`]
                                                )}
                                              </h6>
                                            </div>
                                          </div>

                                          <div className="col-md-5">
                                            <div className="text-md-end">
                                              <button
                                                className="btn btn-light border text-danger icon-hover-danger text-end"
                                                onClick={() => Remove(data.id)}
                                                disabled={removingItemId === data.id}
                                              >
                                                {removingItemId === data.id ? (
                                                  <CgSpinner
                                                    size={20}
                                                    className="animate_spin"
                                                  />
                                                ) : (
                                                  <MdDelete />
                                                )}
                                              </button>
                                            </div>
                                          </div>
                                          <div className="col-md-12">
                                            <hr className="mt-0" />
                                          </div>
                                        </React.Fragment>
                                      );
                                    })}
                                  </>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-3 mt-3 mt-md-0">
                            {!show && (
                              <div className="card mb-3 border shadow-0">
                                <div className="card-body">
                                  <form onSubmit={Applycoupen}>
                                  <div className="form-group">
                                    <label className="form-label">
                                      Have a Dealer coupon?
                                    </label>
                                    <div className="input-group" style={{ display: 'flex', flexWrap: 'nowrap' }}>
                                      <input
                                        type="text"
                                        name="dealer_code"
                                        className="form-control border"
                                        placeholder="Dealer coupon code"
                                        value={dealer_code}
                                        onChange={(e) => handleDealercode(e)}
                                        style={{ flex: '1', minWidth: 0 }}
                                      />
                                      <button
                                        className="btn btn-light border"
                                        onClick={(e) => Applycoupen(e)}
                                        style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                                      >
                                        Apply
                                      </button>
                                    </div>
                                    {isFormEmpty ? (
                                      <span className="text-danger">
                                        {isFormEmpty}
                                      </span>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                  </form>
                                </div>
                              </div>
                            )}
                            <div className="card shadow-0 border">
                              <div className="card-body">
                                {/* SUBTOTAL BEFORE DISCOUNT */}
                                <div className="d-flex justify-content-between">
                                    <p className="mb-2">Price (Before Discount) :</p>
                                    <p className="mb-2 fw-bold">
                                      ₹{numberFormat(SubAmount())}
                                    </p>
                                  </div>
                                <hr />
                                
                                {/* DISCOUNT AMOUNT */}
                                {message && discountVal > 0 && (
                                    <>
                                        <div className="d-flex justify-content-between">
                                            <p className="mb-2 text-success">Discount :</p>
                                            <p className="mb-2 fw-bold text-success">
                                            - ₹{numberFormat(discountVal)}
                                            </p>
                                        </div>
                                        <hr />
                                    </>
                                )}
                                
                                {/* SUBTOTAL AFTER DISCOUNT */}
                                <div className="d-flex justify-content-between">
                                    <p className="mb-2">Subtotal  :</p>
                                    <p className="mb-2 fw-bold">
                                      ₹{numberFormat(SubTotalAfterDiscount())}
                                    </p>
                                </div>
                                <hr />
                                
                                {/* GST TOTAL :*/}
                                <div className="d-flex justify-content-between">
                                  <p className="mb-2">GST (3%)</p>
                                  <p className="mb-2 fw-bold">
                                    ₹{numberFormat(SubGST())}
                                  </p>
                                </div>
                                <hr />

                                {/* TOTAL PRICE :*/}
                                <div className="d-flex justify-content-between">
                                  <p className="mb-2">Total Price (Approx) :</p>
                                  <p className="mb-2 fw-bold text-success">
                                    ₹{numberFormat(overAllAmount)}
                                  </p>
                                </div>
                                <hr />

                                {message && (
                                  <div className="message-box mb-3">
                                    <div className="text-end">
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={removeCouping}
                                      >
                                        <Link href="#" legacyBehavior>
                                          <a className="icon">
                                            <IoIosCloseCircleOutline
                                              onClick={removeCoupon}
                                              style={{
                                                color: "#ff0000",
                                                fontSize: "25px",
                                                cursor: "pointer",
                                              }}
                                            />
                                          </a>
                                        </Link>
                                      </OverlayTrigger>
                                    </div>
                                    <span>
                                      You are now eligible for a base
                                      discount&nbsp;
                                      <b>
                                        {code.discount_type === "percentage" ? (
                                          <>({code.discount_value}%)</>
                                        ) : (
                                          <>₹({code.discount_value})</>
                                        )}
                                      </b>
                                      &nbsp;off on making charges.
                                    </span>
                                  </div>
                                )}
                                
                                  <>
                                    <div className="pt-2">
                                      <button
                                        className="btn btn-success w-100 shadow-0 mb-2"
                                        disabled={spinner}
                                        onClick={(e) => {
                                          handlePhonepeClick();
                                          handleProfileData(profileData);
                                        }}
                                      >
                                        {spinner && (
                                          <CgSpinner
                                            size={20}
                                            className="animate_spin me-2"
                                          />
                                        )}
                                        Minimum Advance Payable Amount (₹
                                        {numberFormat(advanceAmount)})
                                      </button>
                                      <button
                                        type="button"
                                        className="light-up-button w-100 rounded-2"
                                        onClick={() => router.push("/shop")}
                                      >
                                        Back to shop
                                      </button>
                                    </div>
                                  </>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="row justify-content-center">
                          <div className="col-lg-8">
                            <div className="card border shadow-sm p-4">
                              <div className="text-center mb-4">
                                <h2 className="card-title mb-0">
                                  Your Shopping Cart
                                </h2>
                              </div>

                              <div className="text-center my-4">
                                <img
                                  src='/assets/images/empty-cart.png'
                                  alt="Empty Cart Illustration"
                                  className="img-fluid mb-3"
                                  style={{ maxWidth: "200px" }}
                                />
                                <h5 className="text-muted mb-3">
                                  Oops! Your cart is empty.
                                </h5>
                                <p className="text-muted">
                                  Explore our collection and add items to your
                                  cart.
                                </p>
                              </div>

                              <div className="text-center">
                                <Link
                                  href="/shop"
                                  className="view_all_btn px-4 py-2"
                                  style={{ borderRadius: "8px" }}
                                  passHref
                                >
                                  <FaLongArrowAltLeft className="mr-2" />{" "}
                                  &nbsp;Back to Shop
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Profile Edit Modal */}
                <Modal
                  className="form_intent profile_model"
                  centered
                  show={showEdit}
                  backdrop="static"
                  onHide={handleClose}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <Form onSubmit={handleUpdateProfile}>
                      <div className="row edit-user-form">
                        {/* Name and Email */}
                        <div className="col-md-6">
                          <Form.Group as={Col} className="mb-2">
                            <Form.Label>Name <span className="text-danger"><b>*</b></span></Form.Label>
                            <Form.Control
                              name="name"
                              defaultValue={selectedData?.name}
                              onChange={handleChange}
                              placeholder="Enter Your Name"
                            />
                            {error.nameErr && (<span className="text-danger">{error.nameErr}</span>)}
                          </Form.Group>
                        </div>
                        <div className="col-md-6">
                          <Form.Group as={Col} className="mb-2">
                            <Form.Label>Email<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              name="email"
                              defaultValue={selectedData?.email}
                              onChange={handleChange}
                              placeholder="Enter Your Email"
                            />
                            <span className="text-danger">{error.emailErr}</span>
                          </Form.Group>
                        </div>
                        
                        {/* Phone and Pan-card */}
                        <div className="col-md-6">
                          <Form.Group as={Col} className="mb-2">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                              defaultValue={profileData?.phone?.replace("+91", "")}
                              disabled
                            />
                          </Form.Group>
                        </div>

                        <div className="col-md-6 mb-3">
                          <Form.Group className="mb-2">
                            <Form.Label>Pan-card {valid ? (<span className="text-danger">*</span>) : ("")}</Form.Label>
                            <Form.Control
                              name="pan_no"
                              defaultValue={selectedData?.pan_no}
                              onChange={handleChange}
                              placeholder="Enter Your Pancard number"
                            />
                            {valid && (<span className="text-danger">{valid}</span>)}
                          </Form.Group>
                        </div>

                        <div className="col-md-12"><hr className="mt-0" /></div>
                        
                        {/* Billing Address (Company Address) */}
                        <div className="col-md-6">
                          <Form.Group as={Col} className="mb-2">
                            <Form.Label>Billing Address <span className="text-danger">*</span></Form.Label>
                            <textarea
                              name="address"
                              className="form-control"
                              defaultValue={selectedData?.address}
                              rows={4}
                              style={{ resize: "none", height: "auto" }}
                              onChange={handleChange}
                              placeholder="Enter Your Address"
                            />
                            {error.addressErr && (<span className="text-danger">{error.addressErr}</span>)}
                          </Form.Group>
                        </div>
                        <div className="col-md-6">
                          <Form.Group className="mb-2">
                            <Form.Label>State<span className="text-danger">*</span></Form.Label>
                            <select
                              className="form-control"
                              name="state"
                              onChange={handleChange}
                              value={userData.state}
                            >
                              <option value="">--state select--</option>
                              {profileData?.states?.map((userstate, index) => (
                                <option key={index} value={userstate.id}>
                                  {userstate.name}
                                </option>
                              ))}
                            </select>
                            <span className="text-danger">{error.stateErr}</span>
                          </Form.Group>
                        </div>
                        <div className="col-md-6">
                          <Form.Group className="mb-2">
                            <Form.Label>City<span className="text-danger">*</span></Form.Label>
                            <select
                              className="form-control"
                              name="city"
                              onChange={handleChange}
                              value={userData.city}
                            >
                              <option value="">--city select--</option>
                              {city?.map((usercity, index) => (
                                <option key={index} value={usercity?.id}>
                                  {usercity?.name}
                                </option>
                              ))}
                            </select>
                            <span className="text-danger">{error.cityErr}</span>
                          </Form.Group>
                        </div>
                        <div className="col-md-6 mb-3">
                          <Form.Group className="mb-2">
                            <Form.Label>Pincode<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              name="pincode"
                              defaultValue={selectedData?.pincode}
                              onChange={handleChange}
                              placeholder="Enter Your Pincode"
                              maxLength={6}
                            />
                            <span className="text-danger">{error.pincodeErr}</span>
                          </Form.Group>
                        </div>
                        
                        {/* Shipping Checkbox */}
                        <div className="address-checkbox-btn">
                          <input
                            type="checkbox"
                            id="checkbox"
                            name="address_same_as_company"
                            className="address-checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            style={{ cursor: "pointer" }}
                          />
                          <label
                            htmlFor="checkbox"
                            className="ms-1 address-check-text"
                            style={{ cursor: "pointer" }}
                          >
                            Shipping Address is as same above then check this box
                          </label>
                        </div>
                        <div className="col-md-12"><hr className="mt-3" /></div>
                        
                        {/* Shipping Address */}
                        <div className="col-md-6">
                          <Form.Group as={Col} className="mb-2">
                            <Form.Label>Shipping Address <span className="text-danger">*</span></Form.Label>
                            <textarea
                              name="shipping_address"
                              className="form-control"
                              value={userData.shipping_address}
                              rows={4}
                              style={{ resize: "none", height: "auto" }}
                              onChange={handleChange}
                              placeholder="Enter Your Address"
                              disabled={isChecked} // Disable if checked
                            />
                            <span className="text-danger">{error.shipping_address_err}</span>
                          </Form.Group>
                        </div>
                        <div className="col-md-6">
                          <Form.Group className="mb-2">
                            <Form.Label>Shipping State <span className="text-danger">*</span></Form.Label>
                            <select
                              className="form-control"
                              name="shipping_state"
                              onChange={handleChange}
                              value={userData.shipping_state}
                              disabled={isChecked} // Disable if checked
                            >
                              <option value="">--shipping state select--</option>
                              {profileData?.states?.map((userstate, index) => (
                                <option key={index} value={userstate.id}>
                                  {userstate.name}
                                </option>
                              ))}
                            </select>
                            <span className="text-danger">{error.shipping_state_err}</span>
                          </Form.Group>
                        </div>
                        <div className="col-md-6">
                          <Form.Group className="mb-2">
                            <Form.Label>Shipping City <span className="text-danger">*</span></Form.Label>
                           <select
                              className="form-control"
                              name="shipping_city"
                              onChange={handleChange}
                              value={userData.shipping_city} 
                              disabled={isChecked} // Disable if checked
                            >
                              <option value="">--shipping City select--</option>
                              {shipping_city?.map((usercity, index) => (
                                <option key={index} value={usercity?.id}> 
                                  {usercity?.name}
                                </option>
                              ))}
                            </select>
                            <span className="text-danger">{error.shipping_city_err}</span>
                          </Form.Group>
                        </div>
                        <div className="col-md-6 mb-3">
                          <Form.Group className="mb-2">
                            <Form.Label>Shipping Pincode <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              name="shipping_pincode"
                              value={userData.shipping_pincode}
                              onChange={handleChange}
                              placeholder="Enter Your Pincode"
                              maxLength={6}
                              disabled={isChecked} // Disable if checked
                            />
                            <span className="text-danger">{error.shipping_pincode_err}</span>
                          </Form.Group>
                        </div>
                      </div>

                      <div className="text-center">
                        <button className="update_order_btn" type="submit" disabled={spinner}>
                          {spinner && (
                            <CgSpinner
                              size={20}
                              className="animate_spin mx-3"
                            />
                          )}
                          {spinner ? "" : "Update"}
                        </button>
                      </div>
                    </Form>
                  </Modal.Body>
                </Modal>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

const ProcessingOrderInner = Cart;

const ProcessingOrder = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ProcessingOrderInner />
  </Suspense>
);

export default ProcessingOrder;