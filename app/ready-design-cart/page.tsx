'use client';
import React, { useContext, useEffect, useState, Suspense } from "react";
import Head from "next/head";
import Loader from "../components/common/Loader";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { CgSpinner } from "react-icons/cg";
import toast from "react-hot-toast";
import { ReadyDesignCartSystem } from "../context/ReadyDesignCartContext";
import UserService from "../services/Cart";
import { Col, Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import profileService from "../services/Auth";
import { ProfileSystem } from "../context/ProfileContext";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Select from "react-select";
const api = process.env.NEXT_PUBLIC_API_KEY;

const ReadyDesignCartInner = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // SSR-safe localStorage access
  const [user_id, setUserId] = useState<string>("");
  const [Verification, setVerification] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("user_id") || "");
      setVerification(localStorage.getItem("verification") || "");
      setPhone(localStorage.getItem("phone") || "");
    }
  }, []);
  console.log(phone,'phone >>>')

  // Fix context usage
  const { dispatch: removeFromCartDispatch } = useContext(ReadyDesignCartSystem as any);
  const { dispatch: resetcartcount } = useContext(ReadyDesignCartSystem as any);
  const { dispatch: profilename, state: namestate } = useContext(ProfileSystem as any);

  const [isLoading, setIsLoading] = useState(true);
  const [Items, setItems] = useState<any[]>([]);
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);
  const [selectPaymentMethod, setSelectPaymentMethod] = useState<string>("");
  const [show, setShow] = useState(false);
  const [dealer_code, setDealer_Code] = useState<string>("");
  const [pin_code, setPin_Code] = useState<string>("");
  const [pin_code_err, setPin_Code_Err] = useState<string>("");
  const [pin_code_msg, setPin_Code_Msg] = useState<string>("");
  const [pin_code_loader, setPin_Code_Loader] = useState(false);
  const [pin_code_valid, setPin_Code_Valid] = useState(false);
  const [isFormEmpty, setIsFormEmpty] = useState<string>("");
  const [code, setCode] = useState<{ discount_type?: string; discount_value?: number; dealer_code?: string }>(
    { discount_type: "", discount_value: 0, dealer_code: "" }
  );
  const [docket_Number, setDocket_Number] = useState<any[]>([]);

  const handleDealercode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDealer_Code(e.target.value);
  };

  const handleSelectPayment = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      setSelectPaymentMethod(selectedOption.value);
    }
  };

  const Applycoupen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    UserService.DealerCode({ phone: phone, dealer_code: dealer_code })
      .then((res) => {
        if (res.status === false) {
          setIsFormEmpty(res.message);
          setShow(false);
          setDealer_Code("");
        } else {
          localStorage.setItem("dealerDiscount", JSON.stringify(res.data));
          setShow(true);
          setCode(res.data);
          setMessage(true);
          localStorage.setItem("dealermessage", JSON.stringify(true));
          setIsFormEmpty("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeCoupon = () => {
    toast.success("Coupon has been removed");
    setDealer_Code("");
    setMessage(false);
    setShow(false);
    localStorage.removeItem("dealerDiscount");
    localStorage.removeItem("dealermessage");
    setCode({ discount_type: "", discount_value: 0 });
    // calculateTotal();
  };

  const handlePincode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 6 && /^[0-9]*$/.test(value)) {
      setPin_Code(value);
    }
  };

  const ApplyPincode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPin_Code_Loader(true);
    UserService.PinCodeCheck({
      token: "d55c9549f11637d0ad4d2808ffc3fcaa",
      pin_code: pin_code,
    })
      .then((res) => {
        if (res?.status === "true") {
          setPin_Code_Err("Service available");
          setPin_Code_Msg("");
          setPin_Code_Valid(true);
          setPin_Code_Loader(false);
        } else if (res?.status === "false") {
          setPin_Code_Err("Service available");
          setPin_Code_Valid(true);
          setPin_Code_Loader(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setPin_Code_Valid(false);
        setPin_Code_Loader(false);
      });
  };

  const Remove = (id: number) => {
    setRemovingItemId(id);
    const payload = id;
    axios
      .post(api + "ready/cart-remove", {
        cart_id: id,
      })
      .then((res) => {
        if (res?.data?.status === true) {
          GetUserCartList();
          toast.success(res?.data?.message);
          if (res?.data?.data?.total_quantity === 0) {
            localStorage.removeItem("dealerDiscount");
            localStorage.removeItem("dealermessage");
          }
          removeFromCartDispatch({
            type: "REMOVE_FROM_CART",
            payload,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setRemovingItemId(null);
      });
  };

  useEffect(() => {
    const savedDiscount = localStorage.getItem("dealerDiscount");
    if (savedDiscount) {
      setCode(JSON.parse(savedDiscount));
      setShow(true);
    }
  }, []);

  useEffect(() => {
    const storedMessage = localStorage.getItem("dealermessage");
    if (storedMessage) {
      setMessage(JSON.parse(storedMessage));
    }
  }, []);

  const removeCouping = <Tooltip id="tooltip">Remove Coupon</Tooltip>;

  const GetUserCartList = async () => {
    console.log("jiiii")
    if (!api || !phone) {
      setIsLoading(false);
      return;
    }
    axios
      .post(api + "ready/cart-list", {
        phone: phone,
      })
      .then((res) => {
        setItems(res?.data?.data?.carts || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setItems([]);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (phone) {
      GetUserCartList();
    } else {
      setIsLoading(false);
    }
  }, [phone]);

  const numberFormat = (value: number) =>
    new Intl.NumberFormat("en-IN")?.format(Math?.round(value));

  const SubAmount = () => {
    let subTotal = 0;

    Items?.forEach((data) => {
      const price = parseFloat(data?.total_amount);
      subTotal += price;
    });

    return subTotal;
  };

  const SubGST = () => {
    let subGst = 0;

    if (code?.discount_value) {
      if (code?.discount_type === "percentage") {
        subGst =
          (SubAmount() - (SubCharge() * code.discount_value) / 100) * 0.03;
      } else {
        subGst = (SubAmount() - code.discount_value) * 0.03;
      }
    } else {
      Items?.forEach((data) => {
        const price = parseFloat(data?.total_amount);
        subGst += price;
      });
      subGst = subGst * 0.03;
    }

    return subGst;
  };

  const SubCharge = () => {
    let subCharge = 0;

    Items?.forEach((data) => {
      const price =
        data?.making_charge_discount > 0
          ? parseFloat(data.making_charge_discount)
          : parseFloat(data.making_charge);
      subCharge += price;
    });
    return subCharge;
  };

  let overAllAmount = SubAmount() + SubGST();

  if (code?.discount_value) {
    if (code?.discount_type === "percentage") {
      overAllAmount =
        overAllAmount - (SubCharge() * code?.discount_value) / 100;
    } else {
      overAllAmount = overAllAmount - code?.discount_value;
    }
  }

  const handlePhonepeClick = () => {
    if (Verification == 2) {
      if (overAllAmount >= 200000 && !userData?.pan_no) {
        setValid(
          "Pancard is required for your total amount is more than 2 lakh or above"
        );
        setShowEdit(true);
        setSpinner(false);
      } else if (overAllAmount < 200000) {
        UserService.PayByPhonepeAPI({
          user_id: user_id,
          total_amount: overAllAmount?.toFixed(),
          ready_order: 1,
        })
          .then((res) => {
            if (res?.success === false) {
              toast.error(res?.message);
            } else {
              window.location.href =
                res?.data?.instrumentResponse?.redirectInfo?.url;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        UserService.PayByPhonepeAPI({
          user_id: user_id,
          total_amount: overAllAmount?.toFixed(),
          ready_order: 1,
        })
          .then((res) => {
            if (res?.success === false) {
              toast.error(res?.message);
            } else {
              window.location.href =
                res?.data?.instrumentResponse?.redirectInfo?.url;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      setShowEdit(true);
      setSpinner(false);
    }
  };

  // const handleCashClick = () => {
  //   if (Verification == 2) {
  //     if (overAllAmount >= 200000 && !userData?.pan_no) {
  //       setValid(
  //         "Pancard is required for your total amount is more than 2 lakh or above"
  //       );
  //       setShowEdit(true);
  //       setSpinner(false);
  //     } else if (overAllAmount < 200000) {
  //       UserService.ShipmentCreate({
  //         consignee_name: "Siddhartha K",
  //         address_line1: "House No: 3405, Gondhali",
  //         address_line2: "Galli",
  //         pinCode: "380007",
  //         auth_receiver_name: "imple",
  //         auth_receiver_phone: "9737392505",
  //         net_weight: "10",
  //         gross_weight: "23",
  //         net_value: "454645",
  //         codValue: "49999",
  //         no_of_packages: "2",
  //         boxes: [
  //           {
  //             box_number: "",
  //             lock_number: "",
  //             length: "",
  //             breadth: "",
  //             height: "",
  //             gross_weight: "",
  //           },
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
  //           if (res?.status == "true") {
  //             console.log(res?.data?.docket_number);
  //             setDocket_Number(res?.data?.docket_number);
  //           }
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });

  //       if (docket_Number?.length > 0) {
  //         axios
  //           .post(api + "ready/purchase-order", {
  //             user_id: user_id,
  //             payment_method: "cash",
  //             cart_items: Items?.map((item) => item?.id),
  //             sub_total: SubAmount(),
  //             gst_amount: SubGST().toFixed(),
  //             total: overAllAmount?.toFixed(),
  //             dealer_code: code?.dealer_code || "",
  //             dealer_discount_type: code?.discount_type || "",
  //             dealer_discount_value: code?.discount_value || "",
  //             charges: SubCharge()?.toFixed() || "",
  //             docate_number: docket_Number ? docket_Number : "",
  //           })
  //           .then((res) => {
  //             if (res.data.status === true) {
  //               navigate(`/ready-order-details/${res?.data?.data}`);
  //               resetcartcount({ type: "RESET_CART" });
  //               toast.success(res.data.message);
  //               localStorage.removeItem("dealerDiscount");
  //               localStorage.removeItem("dealermessage");
  //             } else {
  //               toast.error(res.data.message);
  //               navigate("/");
  //             }
  //             setIsLoading(false);
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //             setIsLoading(false);
  //           });
  //       }
  //     } else {
  //       UserService.ShipmentCreate({
  //         consignee_name: "Siddhartha K",
  //         address_line1: "House No: 3405, Gondhali",
  //         address_line2: "Galli",
  //         pinCode: "380007",
  //         auth_receiver_name: "imple",
  //         auth_receiver_phone: "9737392505",
  //         net_weight: "10",
  //         gross_weight: "23",
  //         net_value: "454645",
  //         codValue: "49999",
  //         no_of_packages: "2",
  //         boxes: [
  //           {
  //             box_number: "",
  //             lock_number: "",
  //             length: "",
  //             breadth: "",
  //             height: "",
  //             gross_weight: "",
  //           },
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
  //           if (res?.status == "true") {
  //             console.log(res?.data?.docket_number);
  //             setDocket_Number(res?.data?.docket_number);
  //           }
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //       if (docket_Number?.length > 0) {
  //         axios
  //           .post(api + "ready/purchase-order", {
  //             user_id: user_id,
  //             payment_method: "cash",
  //             cart_items: Items?.map((item) => item?.id),
  //             sub_total: SubAmount(),
  //             gst_amount: SubGST().toFixed(),
  //             total: overAllAmount?.toFixed(),
  //             dealer_code: code?.dealer_code || "",
  //             dealer_discount_type: code?.discount_type || "",
  //             dealer_discount_value: code?.discount_value || "",
  //             charges: SubCharge()?.toFixed() || "",
  //             docate_number: docket_Number ? docket_Number : "",
  //           })
  //           .then((res) => {
  //             if (res.data.status === true) {
  //               navigate(`/ready-order-details/${res?.data?.data}`);
  //               resetcartcount({ type: "RESET_CART" });
  //               toast.success(res.data.message);
  //               localStorage.removeItem("dealerDiscount");
  //               localStorage.removeItem("dealermessage");
  //             } else {
  //               toast.error(res.data.message);
  //               navigate("/");
  //             }
  //             setIsLoading(false);
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //             setIsLoading(false);
  //           });
  //       }
  //     }
  //   } else {
  //     setShowEdit(true);
  //     setSpinner(false);
  //   }
  // };

  const handleCashClick = () => {
    if (Verification == 2) {
      if (overAllAmount >= 200000 && !userData?.pan_no) {
        setValid(
          "Pancard is required for your total amount is more than 2 lakh or above"
        );
        setShowEdit(true);
        setSpinner(false);
      } else {
        let totalNetWeight = 0;
        let totalGrossWeight = 0;

        Items.forEach((item) => {
          totalNetWeight += item.net_weight;
          totalGrossWeight += item.gross_weight;
        });

        UserService.ShipmentCreate({
          consignee_name: profileData?.name,
          address_line1: profileData?.shipping_address,
          address_line2:
            profileData?.shipping_city_name +
            "," +
            profileData?.shipping_state_name,
          pinCode: profileData?.shipping_pincode,
          auth_receiver_name: profileData?.name,
          auth_receiver_phone: profileData?.phone?.replace("+91", ""),
          net_weight: totalNetWeight.toString(),
          gross_weight: totalGrossWeight.toString(),
          net_value: numberFormat(overAllAmount),
          codValue: "",
          no_of_packages: "1",
          boxes: [
            {
              box_number: "",
              lock_number: "",
              length: "",
              breadth: "",
              height: "",
              gross_weight: "",
            },
          ],
        })
          .then((res) => {
            if (res?.status == "true" && res?.data?.docket_number) {
              const docketNumber = res.data.docket_number;
              setDocket_Number(docketNumber);

              axios
                .post(api + "ready/purchase-order", {
                  user_id: user_id,
                  payment_method: "cash",
                  cart_items: Items?.map((item) => item?.id),
                  sub_total: SubAmount(),
                  gst_amount: SubGST().toFixed(),
                  total: overAllAmount?.toFixed(),
                  dealer_code: code?.dealer_code || "",
                  dealer_discount_type: code?.discount_type || "",
                  dealer_discount_value: code?.discount_value || "",
                  charges: SubCharge()?.toFixed() || "",
                  docate_number: docketNumber,
                })
                .then((res) => {
                  if (res.data.status === true) {
                    router.push(`/ready-order-details/?${res?.data?.data}`);
                    resetcartcount({ type: "RESET_CART" });
                    toast.success(res.data.message);
                    localStorage.removeItem("dealerDiscount");
                    localStorage.removeItem("dealermessage");
                  } else {
                    toast.error(res.data.message);
                    router.push("/");
                  }
                  setIsLoading(false);
                })
                .catch((err) => {
                  console.log(err);
                  setIsLoading(false);
                });
            }
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
          });
      }
    } else {
      setShowEdit(true);
      setSpinner(false);
    }
  };

  useEffect(() => {
    const processOrder = async () => {
      if (pathname === "/ready-processing-order" && Items.length > 0) {
        const queryParams = new URLSearchParams(searchParams.toString());
        const transaction_id = queryParams.get("transaction_id");
        
        // If we've already processed this transaction, don't do it again
        if (transaction_id && localStorage.getItem(`processed_${transaction_id}`)) {
          return;
        }

        let totalNetWeight = 0;
        let totalGrossWeight = 0;

        Items.forEach((item) => {
          totalNetWeight += item.net_weight;
          totalGrossWeight += item.gross_weight;
        });

        try {
          const shipmentRes = await UserService.ShipmentCreate({
            consignee_name: profileData?.name,
            address_line1: profileData?.shipping_address,
            address_line2:
              profileData?.shipping_city_name +
              "," +
              profileData?.shipping_state_name,
            pinCode: profileData?.shipping_pincode,
            auth_receiver_name: profileData?.name,
            auth_receiver_phone: profileData?.phone?.replace("+91", ""),
            net_weight: totalNetWeight.toString(),
            gross_weight: totalGrossWeight.toString(),
            net_value: numberFormat(overAllAmount),
            codValue: "",
            no_of_packages: "1",
            boxes: [
              {
                box_number: "",
                lock_number: "",
                length: "",
                breadth: "",
                height: "",
                gross_weight: "",
              },
            ],
          });

          if (shipmentRes?.status === "true" && shipmentRes?.data?.docket_number) {
            const docketNumber = shipmentRes.data.docket_number;
            setDocket_Number(docketNumber);

            const orderRes = await axios.post(api + "ready/purchase-order", {
              user_id: user_id,
              payment_method: "phonepe",
              cart_items: Items.map((item) => item.id),
              sub_total: SubAmount(),
              gst_amount: SubGST().toFixed(),
              total: overAllAmount?.toFixed(),
              transaction_id: transaction_id || "",
              dealer_code: code?.dealer_code || "",
              dealer_discount_type: code?.discount_type || "",
              dealer_discount_value: code?.discount_value || "",
              charges: SubCharge()?.toFixed() || "",
              docate_number: docketNumber,
            });

            if (orderRes.data.status === true) {
              // Mark this transaction as processed
              if (transaction_id) {
                localStorage.setItem(`processed_${transaction_id}`, 'true');
              }
              
              resetcartcount({ type: "RESET_CART" });
              toast.success(orderRes.data.message);
              localStorage.removeItem("dealerDiscount");
              localStorage.removeItem("dealermessage");
              
              setTimeout(() => {
                router.push(`/ready-order-details/?${orderRes?.data?.data}`);
              }, 1000);
            } else {
              toast.error(orderRes.data.message);
              router.push("/");
            }
          }
        } catch (err) {
          console.error(err);
          toast.error("An error occurred while processing your order");
        } finally {
          setIsLoading(false);
        }
      }
    };

    processOrder();
  }, [pathname, searchParams]);

  const handleClose = () => {
    setShowEdit(false);
  };
  // user profile functionlity here
  const [spinner, setSpinner] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [profileData, setProfileData] = useState([]);
  console.log(profileData,'profileData')
  const [selectedData, setSelectedData] = useState([]);
  const [city, setcity] = useState();
  const [shipping_city, setShipping_city] = useState();
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
  console.log(userData,'userData >>>')
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

  const fetchCity = async (stateId) => {
    await profileService
      .getCity({ state_id: stateId })
      .then((res) => {
        setcity(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchShippingCity = async (cityId) => {
    await profileService
      .getCity({ state_id: cityId })
      .then((res) => {
        setShipping_city(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getProfile = async () => {
  await profileService
    .getProfile({ phone: phone })
    .then((res) => {
      const Billing_shipping_state = res?.data?.state?.name;
      const Billing_shipping_city = res?.data?.city?.name;
      const shipping_state_name = res?.data?.shipping_state?.name;
      const shipping_city_name = res?.data?.shipping_city?.name;
      console.log(res.data,'res.data')
      setProfileData({
        ...res.data,
        state_name: Billing_shipping_state,
        city_name: Billing_shipping_city,
        shipping_state_name: shipping_state_name,
        shipping_city_name: shipping_city_name,
        state: res?.data?.state?.id,        // State ID
        city: res?.data?.city?.id,           // City ID
        shipping_state: res?.data?.shipping_state?.id,  // Shipping state ID
        shipping_city: res?.data?.shipping_city?.id,    // Shipping city ID
      });
      
      setUserData({
        ...res.data,
        state_name: Billing_shipping_state,
        city_name: Billing_shipping_city,
        shipping_state_name: shipping_state_name,
        shipping_city_name: shipping_city_name,
        state: res?.data?.state?.id,       
        city: res?.data?.city?.id,          
        shipping_state: res?.data?.shipping_state?.id, 
        shipping_city: res?.data?.shipping_city?.id,   
      });
      
      res?.data?.state?.id && fetchCity(res?.data?.state?.id);
      res?.data?.shipping_state?.id &&
        fetchShippingCity(res?.data?.shipping_state?.id);
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setIsLoading(false);
    });
};
useEffect(() => {
  if (userData.shipping_state) {
    fetchShippingCity(userData.shipping_state);
  }
}, [userData.shipping_state]);
  useEffect(() => {
    if (phone) {
      getProfile();
    }
  }, [phone]);

  const isValidPan = (panNumber) => {
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;

    return panRegex.test(panNumber);
  };

  const isPriceAboveLimit = SubAmount() + SubGST() >= 200000;

  const pincodeRegex = /^\d{6}$/;

  const FormValidation = () => {
    let isValid = true;
    const validationErrors = { ...error };
    if (!userData.name.trim()) {
      validationErrors.nameErr = "Name is required";
      isValid = false;
    } else {
      validationErrors.nameErr = "";
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
    } else {
      validationErrors.emailErr = "";
    }

    if (isPriceAboveLimit && !userData.pan_no) {
      setValid(
        "Pancard is required for your total amount is more than 2 lakh or above"
      );
      isValid = false;
    } else if (isPriceAboveLimit && !isValidPan(userData.pan_no)) {
      setValid("Invalid pan-card Format");
      isValid = false;
    } else {
      setValid("");
    }

    if (!userData.address.trim()) {
      validationErrors.addressErr = "Address is required";
      isValid = false;
    } else {
      validationErrors.addressErr = "";
    }
    if (!userData.pincode.trim()) {
      validationErrors.pincodeErr = "Pincode is required";
      isValid = false;
    } else if (!pincodeRegex.test(userData.pincode.trim())) {
      validationErrors.pincodeErr = "Pincode must be a 6-digit number";
      isValid = false;
    } else {
      validationErrors.pincodeErr = "";
    }

    if (userData.state == "" || userData.state == undefined) {
      validationErrors.stateErr = "State must be select";
      isValid = false;
    } else {
      validationErrors.stateErr = "";
    }
    if (userData.city == "" || userData.city == undefined) {
      validationErrors.cityErr = "City must be select";
      isValid = false;
    } else {
      validationErrors.cityErr = "";
    }

    if (!isChecked) {
      if (!isChecked && !userData.shipping_address.trim()) {
        validationErrors.shipping_address_err = "Shipping Address is required";
        isValid = false;
      } else {
        validationErrors.shipping_address_err = "";
      }

      if (!userData.shipping_pincode.trim()) {
        validationErrors.shipping_pincode_err = "Shipping Pincode is required";
        isValid = false;
      } else if (!pincodeRegex.test(userData.shipping_pincode.trim())) {
        validationErrors.shipping_pincode_err =
          "Shipping Pincode must be a 6-digit number";
        isValid = false;
      } else {
        validationErrors.shipping_pincode_err = "";
      }

      if (
        userData.shipping_state == "" ||
        userData.shipping_state == undefined
      ) {
        validationErrors.shipping_state_err = "shipping state must be select";
        isValid = false;
      } else {
        validationErrors.shipping_state_err = "";
      }
      if (userData.shipping_city == "" || userData.shipping_city == undefined) {
        validationErrors.shipping_city_err = "shipping city must be select";
        isValid = false;
      } else {
        validationErrors.shipping_city_err = "";
      }
    } else {
      validationErrors.shipping_address_err = "";
      validationErrors.shipping_pincode_err = "";
      validationErrors.shipping_state_err = "";
      validationErrors.shipping_city_err = "";
    }
    setError(validationErrors);
    return isValid;
  };

  const handleProfileData = async (data) => {
    setSelectedData(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pan_no" && value.length > 10) {
      e.target.value = value.slice(0, 10);
    }

    if (name === "state") {
      setUserData({
        ...userData,
        state: value,
        city: "",
      });
    } else if (name === "shipping_state") {
      setUserData({
        ...userData,
        shipping_state: value,
        shipping_city: "",
      });
    } else {
      setUserData({
        ...userData,
        [name]: value,
      });
    }
  };

 const handleCheckboxChange = (event) => {
  setIsChecked(event.target.checked);

  if (event.target.checked) {
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
      shipping_address: "",
      shipping_pincode: "",
      shipping_state: "",
      shipping_city: "",
    });
  }
};

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const isFormValid = FormValidation();
    if (isFormValid) {
      setSpinner(true);
      const formData = new FormData();
      formData.append("id", selectedData.id);
      formData.append("name", userData.name ? userData.name : "");
      formData.append("email", userData.email ? userData.email : "");
      formData.append("phone", userData.phone ? userData.phone : "");
      formData.append("pan_no", userData.pan_no ? userData.pan_no : "");
      formData.append("gst_no", userData.gst_no ? userData.gst_no : "");

      // company address update
      formData.append("address", userData.address ? userData.address : "");
      formData.append("pincode", userData.pincode ? userData.pincode : "");
      formData.append("state", userData.state ? userData.state : "");
      formData.append("city", userData.city ? userData.city : "");

      // checkbox update
      formData.append("address_same_as_company", isChecked ? "1" : "0");

      // shipping address update
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
            getProfile();
            profilename({
              type: "SET_NAME",
              payload: { profilename: !namestate?.profilename },
            });
            toast.success(res.message);
            localStorage.setItem("verification", res.data.verification);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setSpinner(false);
        });
    } else {
    }
  };

  useEffect(() => {
    const validationErrors = {
      shipping_address_err: "",
      shipping_state_err: "",
      shipping_city_err: "",
      shipping_pincode_err: "",
    };

    if (!isChecked) {
      if (!userData.shipping_address.trim()) {
        validationErrors.shipping_address_err = "Shipping address is required";
      }
      if (!userData.shipping_pincode.trim()) {
        validationErrors.shipping_pincode_err = "Shipping pincode is required";
      }
      if (!userData.shipping_state || userData.shipping_state === undefined) {
        validationErrors.shipping_state_err = "Shipping state must be select";
      }
      if (!userData.shipping_city || userData.shipping_city === undefined) {
        validationErrors.shipping_city_err = "Shipping city must be select";
      }
    } else {
      validationErrors.shipping_address_err = "";
      validationErrors.shipping_state_err = "";
      validationErrors.shipping_city_err = "";
      validationErrors.shipping_pincode_err = "";
    }

    setError(validationErrors);
  }, [isChecked, userData]);

  useEffect(() => {
    setIsChecked(profileData?.address_same_as_company === 1);
  }, [profileData?.address_same_as_company]);

  const options =
    overAllAmount > 50000 
      ? [{ value: "PhonePay", label: "PhonePay" }] 
      : [{ value: "Cash on delivery", label: "Cash on delivery" }, { value: "PhonePay", label: "PhonePay" }];
const DiscountAmount = () => {
  if (code?.discount_value) {
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
useEffect(() => {
  GetUserCartList();
}, [selectPaymentMethod]);  return (
    <>
      <Head>
        <title>Impel Store - Ready products cart</title>
      </Head>

     {pathname === "/ready-processing-order" ? (
  isLoading ? (
    <Loader />
  ) : (
    <div className="container text-center">
      <h4>Processing your order...</h4>
      <p>Please wait while we confirm your payment.</p>
    </div>
  )
) :(
        <>
          <section className="cart">
            <div className="container">
              {isLoading ? (
                <>
                <Loader />
                </>
              ) : (
                <>
                  {Items?.length ? (
                    <>
                      <div className="row">
                        <div className="col-md-9">
                          <div className="card border shadow-0">
                            <div className="m-4">
                              <h4 className="card-title mb-4">
                                Your Ready Order Cart
                              </h4>
                              <div className="row gy-3">
                                <>
                                  <div className="col-md-12">
                                    <hr className="mt-0" />
                                  </div>
                                  {Items?.map((data, index) => {
                                    return (
                                      <React.Fragment key={data?.id || data?.tag_no || index}>
                                        <div className="col-md-3">
                                          <div className="d-flex">
                                            <Link
                                              href={`/ready-to-dispatch/${data?.tag_no}`}
                                              className="nav-link"
                                            >
                                              <img
                                                src={`https://api.indianjewelcast.com/TagImage/${data?.barcode}.jpg`}
                                               
                                                className="border rounded me-3 w-100 p-2"
                                                alt=""
                                              />
                                            </Link>
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="cart_product_name">
                                            <Link
                                              href={`/ready-to-dispatch/${data?.tag_no}`}
                                              className="nav-link"
                                            >
                                              <b>{data?.tag_no}</b>
                                            </Link>
                                          </div>

                                          <div className="mt-md-2">
                                            <span>
                                              Gold Color : &nbsp;
                                              <b>{data?.group_name}</b>
                                            </span>
                                          </div>
                                          <div className="mt-3">
                                            <h6>
                                              <strong className="text-success">
                                                ₹
                                                {numberFormat(
                                                  data?.total_amount
                                                )}
                                              </strong>
                                            </h6>
                                          </div>
                                        </div>

                                        <div className="col-md-5">
                                          <div className="text-md-end">
                                            <Link
                                              href="#"
                                              className="btn btn-light border text-danger icon-hover-danger text-end"
                                              onClick={() => Remove(data.id)}
                                            >
                                              {removingItemId === data.id && (
                                                <CgSpinner
                                                  size={20}
                                                  className="animate_spin"
                                                />
                                              )}
                                              {removingItemId === data.id ? (
                                                ""
                                              ) : (
                                                <MdDelete />
                                              )}
                                            </Link>
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
                                <form>
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
    {/* SUB TOTAL :*/}
    <div className="d-flex justify-content-between">
      <p className="mb-2">Price :</p>
      <p className="mb-2 fw-bold">
        ₹{numberFormat(SubAmount())}
      </p>
    </div>
    <hr />

    {/* DISCOUNT (if applied) */}
    {message && code?.discount_value && (
      <>
        <div className="d-flex justify-content-between">
          <p className="mb-2 text-success">Discount :</p>
          <p className="mb-2 fw-bold text-success">
            - ₹{numberFormat(DiscountAmount())}
          </p>
        </div>
        <hr />
        
        {/* SUBTOTAL AFTER DISCOUNT */}
        <div className="d-flex justify-content-between">
          <p className="mb-2">Subtotal  :</p>
          <p className="mb-2 fw-bold">
            ₹{numberFormat(SubTotalAfterDiscount())}
          </p>
        </div>
        <hr />
      </>
    )}

    {/* GST TOTAL :*/}
    <div className="d-flex justify-content-between">
      <p className="mb-2">GST (3%) :</p>
      <p className="mb-2 fw-bold">
        ₹{numberFormat(SubGST()?.toFixed())}
      </p>
    </div>
    <hr />

    {/* TOTAL PRICE :*/}
    <div className="d-flex justify-content-between">
      <p className="mb-2">Total price :</p>
      <div>
        {message ? (
          <>
            <del className="text-danger me-2">
              ₹{numberFormat(SubAmount() + (SubAmount() * 0.03))}
            </del>
            <span className="fw-bold text-success">
              ₹{numberFormat(overAllAmount)}
            </span>
          </>
        ) : (
          <>
            <p className="mb-2 fw-bold">
              ₹{numberFormat(overAllAmount)}
            </p>
          </>
        )}
      </div>
    </div>
    <hr />

    {message && (
      <div className="message-box mb-3">
        <div className="text-end">
          <OverlayTrigger
            placement="top"
            overlay={removeCouping}
          >
            <Link className="icon" href="#">
              <IoIosCloseCircleOutline
                onClick={removeCoupon}
                style={{
                  color: "#ff0000",
                  fontSize: "25px",
                  cursor: "pointer",
                }}
              />
            </Link>
          </OverlayTrigger>
        </div>
        <span>
          You are now eligible for a base discount&nbsp;
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
                              <div>
                                <form onSubmit={ApplyPincode}>
                                  {/* <div className="form-group">
                                    <div className="input-group">
                                      <input
                                        type="number"
                                        name="pin_code"
                                        className="form-control border"
                                        placeholder="Enter pincode"
                                        value={pin_code}
                                        onChange={(e) => handlePincode(e)}
                                        required
                                        min="100000"
                                        max="999999"
                                        pattern="^\d{6}$"
                                        title="Please enter a valid 6-digit pin code"
                                      />

                                      {pin_code_loader ? (
                                        <>
                                          <Spin
                                            indicator={
                                              <LoadingOutlined
                                                spin
                                                style={{ margin: "10px" }}
                                              />
                                            }
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <button
                                            type="submit"
                                            className="btn btn-light border"
                                          >
                                            Check
                                          </button>
                                        </>
                                      )}
                                    </div>
                                    {pin_code_err && (
                                      <span className="text-success fw-bold">
                                        {pin_code_err}
                                      </span>
                                    )}
                                    {pin_code_msg && (
                                      <span className="text-danger fw-bold">
                                        {pin_code_msg}
                                      </span>
                                    )}
                                  </div> */}
                                </form>
                              </div>
                                <>
                                <div className="mt-2">
                                    <label htmlFor="Payment Method">
                                      Payment Method :
                                    </label>
                                    <Select
                                      options={options}
                                      placeholder="Select payment method"
                                      value={options.find(opt => opt.value === selectPaymentMethod) || null}
                                      onChange={handleSelectPayment}
                                      className="mt-1"
                                      classNamePrefix="select"
                                      isSearchable={false}
                                    />
                                  </div>

                                  <div className="pt-2">
                                    {selectPaymentMethod ===
                                    "Cash on delivery" ? (
                                      <button
                                        className="btn btn-success w-100 shadow-0 mb-2"
                                        disabled={!selectPaymentMethod}
                                        onClick={(e) => {
                                          handleCashClick();
                                          handleProfileData(profileData);
                                        }}
                                      >
                                        {" "}
                                        {spinner && (
                                          <CgSpinner
                                            size={20}
                                            className="animate_spin me-2"
                                          />
                                        )}
                                        {selectPaymentMethod ===
                                        "Cash on delivery"
                                          ? "Place Order"
                                          : "Proceed to Pay"}
                                      </button>
                                    ) : (
                                      <button
                                        className="btn btn-success w-100 shadow-0 mb-2"
                                        disabled={!selectPaymentMethod}
                                        onClick={(e) => {
                                          handlePhonepeClick();
                                          handleProfileData(profileData);
                                        }}
                                      >
                                        Proceed to pay
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      className="light-up-button w-100 rounded-2"
                                      onClick={() =>
                                        router.push("/ready-to-dispatch")
                                      }
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
                                Your Ready Order Cart
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
                                href="/ready-to-dispatch"
                                className="view_all_btn px-4 py-2"
                                style={{ borderRadius: "8px" }}
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

              <Modal
                className="form_intent profile_model"
                centered
                show={showEdit}
                onHide={handleClose}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  <Form onSubmit={(e) => handleUpdateProfile(e, selectedData)}>
                    <div className="row edit-user-form">
                      <div className="col-md-6">
                        <Form.Group
                          as={Col}
                          className="mb-2"
                          controlId="formGridState"
                        >
                          <Form.Label>
                            Name
                            <span className="text-danger">
                              <b>*</b>
                            </span>
                          </Form.Label>
                          <Form.Control
                            name="name"
                            defaultValue={selectedData.name}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter Your Name"
                          />
                          {error.nameErr && (
                            <span className="text-danger">{error.nameErr}</span>
                          )}
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group
                          as={Col}
                          className="mb-2"
                          controlId="formGridState"
                        >
                          <Form.Label>
                            Email<span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            name="email"
                            defaultValue={selectedData.email}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter Your Email"
                          />
                          <span className="text-danger">{error.emailErr}</span>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group
                          as={Col}
                          className="mb-2"
                          controlId="formGridState"
                        >
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            defaultValue={profileData?.phone?.replace(
                              "+91",
                              ""
                            )}
                            disabled
                          />
                        </Form.Group>
                      </div>

                      <div className="col-md-6 mb-3">
                        <Form.Group
                          className="mb-2"
                          controlId="formGridAddress1"
                        >
                          <Form.Label>
                            Pan-card
                            {valid ? (
                              <span className="text-danger">*</span>
                            ) : (
                              ""
                            )}
                          </Form.Label>
                          <Form.Control
                            name="pan_no"
                            defaultValue={selectedData.pan_no}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter Your Pancard number"
                          />
                          {valid && (
                            <span className="text-danger">{valid}</span>
                          )}
                        </Form.Group>
                      </div>

                      <div className="col-md-12">
                        <hr className="mt-0" />
                      </div>
                      <div className="col-md-6">
                        <Form.Group
                          as={Col}
                          className="mb-2"
                          controlId="formGridZip"
                        >
                          <Form.Label>
                            Billing Address
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <textarea
                            name="address"
                            className="form-control"
                            defaultValue={selectedData.address}
                            rows={4}
                            style={{ resize: "none", height: "auto" }}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            placeholder="Enter Your Address"
                          />
                          {error.addressErr && (
                            <span className="text-danger">
                              {error.addressErr}
                            </span>
                          )}
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group
                          className="mb-2"
                          controlId="formGridAddress1"
                        >
                          <Form.Label>
                            State<span className="text-danger">*</span>
                          </Form.Label>
                          <select
                            className="form-control"
                            name="state"
                            onChange={(e) => {
                              handleChange(e);
                              fetchCity(e.target.value);
                            }}
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
                        <Form.Group
                          className="mb-2"
                          controlId="formGridAddress1"
                        >
                          <Form.Label>
                            City<span className="text-danger">*</span>
                          </Form.Label>
                          <select
                            className="form-control"
                            name="city"
                            onChange={(e) => {
                              handleChange(e);
                            }}
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
                        <Form.Group
                          className="mb-2"
                          controlId="formGridAddress1"
                        >
                          <Form.Label>
                            Pincode<span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            name="pincode"
                            defaultValue={selectedData.pincode}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter Your Pincode"
                            maxLength={6}
                          />
                          <span className="text-danger">
                            {error.pincodeErr}
                          </span>
                        </Form.Group>
                      </div>
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
                      <div className="col-md-12">
                        <hr className="mt-3" />
                      </div>
                      <div className="col-md-6">
                        <Form.Group
                          as={Col}
                          className="mb-2"
                          controlId="formGridZip"
                        >
                          <Form.Label>
                            Shipping Address
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <textarea
                            name="shipping_address"
                            className="form-control"
                            value={userData.shipping_address}
                            rows={4}
                            style={{ resize: "none", height: "auto" }}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            placeholder="Enter Your Address"
                          />
                          <span className="text-danger">
                            {error.shipping_address_err}
                          </span>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group
                          className="mb-2"
                          controlId="formGridAddress1"
                        >
                          <Form.Label>
                            Shipping State<span className="text-danger">*</span>
                          </Form.Label>
                          <select
                            className="form-control"
                            name="shipping_state"
                            onChange={(e) => {
                              handleChange(e);
                              fetchShippingCity(e.target.value);
                            }}
                            value={userData.shipping_state}
                          >
                            <option value="">--shipping state select--</option>
                            {profileData?.states?.map((userstate, index) => (
                              <option key={index} value={userstate.id}>
                                {userstate.name}
                              </option>
                            ))}
                          </select>
                          <span className="text-danger">
                            {error.shipping_state_err}
                          </span>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group
                          className="mb-2"
                          controlId="formGridAddress1"
                        >
                          <Form.Label>
                            Shipping City<span className="text-danger">*</span>
                          </Form.Label>
                         <select
  className="form-control"
  name="shipping_city"
  onChange={(e) => {
    handleChange(e);
  }}
  value={userData.shipping_city} 
>
  <option value="">--shipping City select--</option>
  {shipping_city?.map((usercity, index) => (
    <option key={index} value={usercity?.id}>
      {usercity?.name}
    </option>
  ))}
</select>
                          <span className="text-danger">
                            {error.shipping_city_err}
                          </span>
                        </Form.Group>
                      </div>
                      <div className="col-md-6 mb-3">
                        <Form.Group
                          className="mb-2"
                          controlId="formGridAddress1"
                        >
                          <Form.Label>
                            Shipping Pincode
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            name="shipping_pincode"
                            value={userData.shipping_pincode}
                            onChange={(e) => handleChange(e)}
                            placeholder="Enter Your Pincode"
                            maxLength={6}
                          />
                          <span className="text-danger">
                            {error.shipping_pincode_err}
                          </span>
                        </Form.Group>
                      </div>
                    </div>

                    <div className="text-center">
                      <button className="update_order_btn">
                        {spinner && (
                          <CgSpinner size={20} className="animate_spin mx-3" />
                        )}
                        {spinner ? "" : "Update"}
                      </button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>
            </div>
          </section>
        </>
      )}
    </>
  );
};

const ReadyDesignCart = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ReadyDesignCartInner />
  </Suspense>
);

export default ReadyDesignCart;
