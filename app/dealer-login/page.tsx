'use client'; // Marking as client component for hooks and state

import React, { useRef, useState } from "react";
import Link from "next/link"; // Replaced Link from 'react-router-dom'
import { useRouter } from "next/navigation";
import Head from "next/head"; // Replaced Helmet from 'react-helmet-async'
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import dynamic from "next/dynamic"; // For client-side-only imports

import profileService from "../services/Auth";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Dynamically import ReCAPTCHA, disabling SSR
const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
});

const validationSchema = Yup.object({
  login: Yup.string()
    .test(
      "email-or-phone",
      "Enter a valid email or 10-digit phone number",
      value => {
        if (!value) return false;
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        const phoneRegex = /^\d{10}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      }
    )
    .required("Email or phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const DealerLogin = () => {
  const recaptcha = useRef();
  const router = useRouter(); // Initialize Next.js router
  const [captcha, setCaptcha] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [passwordType, setPasswordType] = useState("password");


  const mutation = useMutation({
    mutationFn: (userData) => profileService.dealerLogin(userData),
    onSuccess: (response) => {
      if (response?.success) {
        toast.success(response?.message);
        // localStorage is accessed only on the client-side due to SSR safety
        if (typeof window !== 'undefined') {
          localStorage.setItem("isLogin", true);
          localStorage.setItem("token", response?.data?.token);
          localStorage.setItem("user_id", response?.data?.user?.id);
          localStorage.setItem("user_type", response?.data?.user?.user_type);
          localStorage.setItem("email", response?.data?.user?.email);
        }
        router.push("/");
      } else {
        toast.error(response?.message);
        router.push("/dealer-login");
      }
    },
    onError: (error) => console.error("Login failed", error),
    onSettled: () => setSpinner(false),
  });

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    // Check window only once to safely access ReCAPTCHA ref
    const captchaValue = typeof window !== 'undefined' ? recaptcha.current?.getValue() : null;

    if (!captchaValue) {
      setCaptcha("Please verify CAPTCHA.");
      setSubmitting(false);
      return;
    }

    setSpinner(true);
    setCaptcha(""); // Clear captcha error on new submission attempt

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const phoneRegex = /^\d{10}$/;
    let payload = { password: values.password };

    if (emailRegex.test(values.login)) {
      payload.email = values.login;
    } else if (phoneRegex.test(values.login)) {
      payload.phone = values.login;
    }

    mutation.mutate(payload, {
      onSettled: () => {
        setSubmitting(false); 
      },
    });
  };

  const togglePassword = () =>
    setPasswordType(passwordType === "password" ? "text" : "password");

  return (
    <>
      {/* Replaced Helmet with Next.js Head component */}
      <Head>
        <title>Impel Store - Dealer Login</title>
      </Head>
      <section className="login">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="login_detail">
                <div className="text-center">
                  {/* Replaced <Link to="/"> with <Link href="/"> */}
                  <Link href="/">
                    <img src='/assets/images/logo.png' alt="logo" />
                  </Link>
                </div>
                <h2 className="mb-4">Dealer Login</h2>

                <Formik
                  initialValues={{ login: "", password: "" }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="form-group">
                        <Field
                          type="text"
                          name="login"
                          placeholder="Enter your email or 10-digit mobile number"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="login"
                          component="span"
                          className="text-danger"
                        />
                      </div>

                      <div className="form-group">
                        <div className="position-relative">
                          <Field
                            type={passwordType}
                            name="password"
                            placeholder="Password"
                            className="form-control"
                          />
                          <span className="toggle_btn" onClick={togglePassword}>
                            {passwordType === "password" ? (
                              <FaEyeSlash />
                            ) : (
                              <FaEye />
                            )}
                          </span>
                          <ErrorMessage
                            name="password"
                            component="span"
                            className="text-danger"
                          />
                        </div>
                      </div>

                      <div className="mt-4 d-flex align-items-center justify-content-center">
                        {/* ReCAPTCHA is dynamically loaded (ssr: false) */}
                        <ReCAPTCHA
                          ref={recaptcha}
                          sitekey="6Lc7Em0pAAAAAHHha3qWzytW6qKfkBqh8ResnmfR"
                        />
                      </div>
                      {captcha && (
                        <div className="text-center text-danger">{captcha}</div>
                      )}

                      <div className="form-group">
                        <button
                          type="submit"
                          className="dealer_login_btn"
                          disabled={isSubmitting || spinner}
                        >
                          {spinner ? (
                            <CgSpinner
                              size={20}
                              className="animate_spin me-2"
                            />
                          ) : (
                            "Login"
                          )}
                        </button>
                        <div className="d-flex justify-content-between">
                          {/* Replaced <Link to="..."> with <Link href="..."> */}
                          <Link
                            href="/forget-password"
                            className="text-decoration-none text-danger"
                          >
                            Forgot Password?
                          </Link>
                          {/* Replaced <Link to="..."> with <Link href="..."> */}
                          <Link
                            href="/login"
                            className="text-decoration-none text-success"
                          >
                            Customer Login?
                          </Link>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DealerLogin;