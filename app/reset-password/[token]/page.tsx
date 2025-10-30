'use client'; // 👈 Mark as a Client Component

import React, { useState } from "react";
import toast from "react-hot-toast";
// Import Next.js specific components and hooks
import { useRouter, useParams } from "next/navigation"; 
// Use direct <title> tag for client component head updates
import Image from "next/image"; // For optimizing local images

// Removed: import { useNavigate, useParams } from "react-router-dom";
// Removed: import { Helmet } from "react-helmet-async";

import DealerServices from "../../services/Dealer/ResetPassword"; // Assuming path is correct
import { CgSpinner } from "react-icons/cg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "../../assets/images/logo.png"; // Assuming local path

const Resetpassword = () => {
  // Use Next.js useParams to get the dynamic segment (token)
  const params = useParams(); 
  const resetToken = params.token; // Assuming the route is /reset-password/[token]

  const router = useRouter(); // 👈 Next.js navigation hook

  const [input, setInput] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [spinner, setSpinner] = useState(false);
  const [passwordType, setPasswordType] = useState("password");

  const handleChange = (event) => {
    setInput({
      ...input,
      [event.target.name]: event.target.value,
    });
  };
  
  const validate = () => {
    let newErrors = {};
    let isValid = true;

    if (!input.password) {
      isValid = false;
      newErrors["password"] = "Please enter your password.";
    } else if (input.password.length < 6) {
      isValid = false;
      newErrors["password"] = "Please add at least 6 characters.";
    }

    if (!input.confirmPassword) {
      isValid = false;
      newErrors["confirmPassword"] = "Please enter your confirm password.";
    }

    if (
      input.password &&
      input.confirmPassword &&
      input.password !== input.confirmPassword
    ) {
      isValid = false;
      newErrors["confirmPassword"] =
        "Password and Confirm password doesn't match.";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      setSpinner(true);
      DealerServices.ResetPassword({
        password: input.password,
        confirm_password: input.confirmPassword,
        remember_token: resetToken, // Use token from Next.js useParams
      })
        .then((res) => {
          if (res.status === false) {
            toast.error(res.message);
            setInput({
              password: "",
              confirmPassword: "",
            });
          } else {
            toast.success(res.message);
            setInput({
              password: "",
              confirmPassword: "",
            });
            setTimeout(() => {
              // Use Next.js router.push for navigation
              router.push("/dealer-login"); 
            }, 1200);
          }
        })
        .catch((error) => console.error("Reset password failed:", error))
        .finally(() => {
          setSpinner(false);
        });
    }
  };

  const togglePassword = (e) => {
    e.preventDefault();
    // Use the functional update form for clarity
    setPasswordType(prevType => prevType === "password" ? "text" : "password");
  };

  return (
    <>
      {/* Client-side equivalent for setting the page title */}
      <title>Impel Store - Reset Password</title>
      
      <section className="login">
        <div className="container">
          <div className="">
            <div className="row justify-content-center">
              <div className="col-md-5">
                <div className="login_detail">
                  <div className="text-center">
                    {/* Use Next.js Image component for local image optimization */}
                    <Image 
                        src='/assets/images/logo.png'
                        alt="logo" 
                        // You must provide explicit width and height for Image component
                        width={150} 
                        height={50} 
                        style={{ height: 'auto' }}
                    />
                  </div>
                  <h2>Reset Password</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input
                        type={passwordType}
                        name="password"
                        placeholder="Password"
                        className="form-control"
                        value={input.password}
                        onChange={handleChange}
                      />
                      <div className="text-danger">{errors.password}</div>
                    </div>
                    <div className="form-group">
                      <div className="position-relative">
                        <input
                          type={passwordType}
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          className="form-control"
                          value={input.confirmPassword}
                          onChange={handleChange}
                        />
                        <button
                          className="toggle_btn"
                          onClick={togglePassword}
                          type="button" // Important: use type="button" to prevent form submission
                          aria-label={passwordType === "password" ? "Show password" : "Hide password"}
                        >
                          {passwordType === "password" ? (
                            <FaEye />
                          ) : (
                            <FaEyeSlash />
                          )}
                        </button>
                      </div>
                      <div className="text-danger">
                        {errors.confirmPassword}
                      </div>
                    </div>
                    <div className="form-group">
                      <button className="reset_pass_btn" type="submit" disabled={spinner}>
                        {spinner && (
                          <CgSpinner size={20} className="animate_spin me-2" />
                        )}
                        Reset Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Resetpassword;