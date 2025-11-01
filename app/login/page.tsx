
"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import profileService from "../services/Auth"; // Uncomment and adjust path if needed

const PhoneInput = dynamic(() => import("../components/PhoneInputClient"), {
  ssr: false,
  loading: () => (
    <input
      className="form-control"
      disabled
      placeholder="Loading phone input..."
    />
  ),
});

const OTPInput = dynamic(() => import("../components/OtpInputClient"), {
  ssr: false,
  loading: () => (
    <input className="form-control text-center" disabled placeholder="------" />
  ),
});

const Login = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string>("");
  const [spinner, setSpinner] = useState<boolean>(false);
  const [phonedata, setPhoneData] = useState<any>(null);

  const handlePhoneNumberChange = (newPhoneNumber: string) => {
    let isValid = true;
    if (!newPhoneNumber) {
      setPhoneError("Please enter your mobile number");
      isValid = false;
    } else if (newPhoneNumber.length !== 12) {
      setPhoneError("Your mobile number should be 10 digits");
      isValid = false;
    } else {
      setPhoneError("");
    }
    setPhoneNumber(newPhoneNumber);
    return isValid;
  };

  const sendOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phoneNumber) {
      setPhoneError("Please enter your mobile number");
    } else if (phoneNumber.length !== 12) {
      setPhoneError("Your mobile number should be 10 digits");
    } else {
      setPhoneError("");
      const formatPh = `+${phoneNumber}`;
      setSpinner(true);
      profileService
        .checkUser({ phone: formatPh })
        .then((res) => {
          if (res?.data?.status === 0) {
            toast.error(res?.data?.message);
            router.push("/login");
            return;
          } else {
            profileService
              .otpLogin({ number: formatPh })
              .then((datas) => {
                toast.success("OTP sent successfully!");
                setPhoneData(res?.data);
                setShow(true);
              })
              .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                setSpinner(false);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          setSpinner(false);
        });
    }
  };

  const handleOtpVerification = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSpinner(true);
    const code = otp;
    const datas = {
      otp: parseInt(code),
      number: parseInt(phoneNumber),
    };
    profileService
      .otpVerify(datas)
      .then((datas) => {
        if (datas?.status === true) {
          toast.success("Login Successfully...");
          localStorage.setItem("phone", "+" + phoneNumber);
          localStorage.setItem("user_type", phonedata?.user_type);
          localStorage.setItem("user_id", phonedata?.user_id);
          localStorage.setItem("verification", phonedata?.verification);
          
          // Dispatch custom event to notify Navbar about auth state change
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("authStateChanged"));
          }
          
          const redirectPath = localStorage.getItem("redirectPath");
          localStorage.removeItem("redirectPath");
          localStorage.removeItem("showPopup");
          if (redirectPath) {
            router.push(redirectPath);
          } else {
            router.back();
          }
        } else if (datas?.message === "Your OTP has been expired") {
          toast.error("Your OTP has been expired");
          setOtp("");
        } else {
          toast.error("Invalid OTP");
          setOtp("");
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setSpinner(false);
      });
  };

  const PhoneNumber = phoneNumber.replace("91", "");
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("currentPath", window.location.pathname);
    }
  }, []);

  return (
    <section className="login">
      <div className="container">
        <div className="row justify-content-center text-align-center">
          <div className="col-md-5">
            <div className="user-login-form">
              {!show && (
                <>
                  <form
                    onSubmit={sendOtp}
                    className="d-flex flex-column gap-2 form w-100"
                  >
                    <div className="text-center mb-4">
                      <Link href="/">
                        <Image src="/assets/images/logo.png" alt="logo" width={120} height={40} />
                      </Link>
                    </div>
                    <h5>Welcome</h5>
                    <span>
                      Enter phone number to continue and we will send a verification code to this number.
                    </span>
                    <div className="my-3">
                      <PhoneInput
                        country={"in"}
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        placeholder="Enter Your Phone Number"
                        enableSearch
                        disableSearchIcon
                        countryCodeEditable={false}
                        disableDropdown
                        enableAreaCodes={true}
                        autoFormat
                      />
                      {phoneError && (
                        <div
                          className="text-danger ms-5 ps-5"
                          style={{ fontWeight: "600" }}
                        >
                          {phoneError}
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="customer_login_btn"
                      id="sign-in-button"
                      disabled={spinner}
                    >
                      {spinner && (
                        <CgSpinner
                          size={20}
                          className="animate_spin text-center mx-2"
                          role="button"
                        />
                      )}
                      {spinner ? "" : "Login To Continue"}
                    </button>
                  </form>
                  <div className="col-md-12 text-end mt-2">
                    <Link
                      href="/dealer-login"
                      className="text-decoration-none text-success"
                      style={{ fontWeight: "700", fontSize: "18px" }}
                    >
                      Dealer Login ?
                    </Link>
                  </div>
                </>
              )}
              {show && (
                <>
                  <form
                    onSubmit={handleOtpVerification}
                    className="d-flex flex-column gap-2 form w-100"
                  >
                    <h5>Enter Verification Code</h5>
                    <span>
                      We have sent a verification code to
                      <p>
                        {PhoneNumber.substring(0, 2) +
                          "*".repeat(PhoneNumber.length - 4) +
                          PhoneNumber.slice(-2)}
                      </p>
                    </span>
                    <div>
                      <OTPInput
                        className="otp-container"
                        value={otp}
                        onChange={setOtp}
                        autoFocus
                        OTPLength={6}
                        otpType="number"
                        disabled={false}
                        placeholder="------"
                      />
                    </div>
                    <div className="button-container d-flex gap-5 mt-3">
                      <button
                        type="submit"
                        id="sign-in-button"
                        disabled={otp?.length < 6}
                      >
                        {spinner && (
                          <CgSpinner
                            size={20}
                            className="animate_spin text-center mx-3"
                          />
                        )}
                        {spinner ? "" : "Verify and Proceed"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const LoginPage = dynamic(() => Promise.resolve(Login), {
  ssr: false,
});

export default LoginPage;
