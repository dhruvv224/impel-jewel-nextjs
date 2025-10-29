"use client"
import React, { useEffect, useState } from "react";
// 1. Replace react-router-dom Link with next/link
import Link from "next/link";
// 2. Import Head from next/head for SEO
import Head from "next/head";
import { CgSpinner } from "react-icons/cg";
import { useMutation } from "@tanstack/react-query";

// Assuming these paths are correct in your Next.js project structure
import DealerServices from "../services/Dealer/ResetPassword";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const ForgetPassword = () => {
  const [message, setMessage] = useState("");
  const [errmessage, setErrMessage] = useState("");
  const [spinner, setSpinner] = useState(false);

  // NOTE: The timeout duration (400000000 ms) is extremely long (over 11 years).
  // I recommend changing it to a reasonable duration, e.g., 5000 ms (5 seconds).
  const MESSAGE_TIMEOUT_MS = 5000; // 5 seconds

  // React Query mutation for forget password
  const mutation = useMutation({
    mutationFn: (emailData) =>
      DealerServices.ForgetPassword({
        email: emailData.email,
        // window.location.origin is generally safe in a client-side component,
        // but ensure it works correctly if server-side rendering is a factor.
        reset_url: `${window.location.origin}/reset-password`,
      }),
    onMutate: () => {
      setSpinner(true);
      setMessage("");
      setErrMessage("");
    },
    onSuccess: (res) => {
      setSpinner(false);
      // Assuming 'status' is a boolean or can be evaluated as truthy/falsy
      res.status ? setMessage(res.message) : setErrMessage(res.message);
    },
    onError: () => {
      setSpinner(false);
      setErrMessage("An error occurred. Please try again.");
    },
    onSettled: () => setSpinner(false),
  });

  const handleSubmit = (values) => mutation.mutate(values);

  useEffect(() => {
    // Corrected timeout duration
    let timeoutId;
    if (message || errmessage) {
      timeoutId = setTimeout(() => {
        setMessage("");
        setErrMessage("");
      }, MESSAGE_TIMEOUT_MS);
    }

    return () => clearTimeout(timeoutId);
  }, [message, errmessage]);

  return (
    <>
      {/* 2. Replaced Helmet with Next.js Head component */}
      <Head>
        <title>Impel Store - Forget Password</title>
      </Head>
      <section className="login">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="login_detail">
                <div className="text-center">
                  <img src='/assets/images/logo.png' alt="logo" />
                </div>
                <h2>Forget Password</h2>
                {/* Status Messages */}
                {message && (
                  <div className={`message-container ${message ? "my-1" : ""}`}>
                    {message && <span className="message-text">{message}</span>}
                  </div>
                )}
                {errmessage && (
                  <div className="message-container my-2 text-danger">
                    <span className="message-text">{errmessage}</span>
                  </div>
                )}
                {/* Form */}
                <Formik
                  initialValues={{ email: "" }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="form-group">
                        <Field
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Registered Email ID"
                        />
                        <ErrorMessage
                          name="email"
                          component="span"
                          className="text-danger"
                        />
                      </div>
                      <button className="forget_pass_btn" type="submit" disabled={isSubmitting || mutation.isLoading}>
                        {(spinner || mutation.isLoading) && ( // Use mutation.isLoading for better React Query integration
                          <CgSpinner size={20} className="animate_spin me-2" />
                        )}
                        Send reset password link
                      </button>
                    </Form>
                  )}
                </Formik>

                <p>
                  {/* 1. Next.js Link uses 'href' and wraps an anchor tag */}
                  <Link href="/dealer-login" passHref legacyBehavior>
                    <a className="text-decoration-none text-success">
                      Back to dealer login
                    </a>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgetPassword;