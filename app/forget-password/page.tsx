import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";
import { useMutation } from "@tanstack/react-query";
import DealerServices from "../../services/Dealer/ResetPassword";
import Logo from "../../assets/images/logo.png";
import { Helmet } from "react-helmet-async";
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

  // React Query mutation for forget password
  const mutation = useMutation({
    mutationFn: (emailData) =>
      DealerServices.ForgetPassword({
        email: emailData.email,
        reset_url: `${window.location.origin}/reset-password`,
      }),
    onMutate: () => {
      setSpinner(true);
      setMessage("");
      setErrMessage("");
    },
    onSuccess: (res) => {
      setSpinner(false);
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
    const timeoutId = setTimeout(() => {
      setMessage("");
      setErrMessage("");
    }, 400000000);

    return () => clearTimeout(timeoutId);
  }, [message, errmessage]);

  return (
    <>
      <Helmet>
        <title>Impel Store - Forget Password</title>
      </Helmet>
      <section className="login">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="login_detail">
                <div className="text-center">
                  <img src={Logo} alt="logo" />
                </div>
                <h2>Forget Password</h2>
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
                      <button className="forget_pass_btn" type="submit">
                        {spinner && (
                          <CgSpinner size={20} className="animate_spin me-2" />
                        )}
                        Send reset password link
                      </button>
                    </Form>
                  )}
                </Formik>

                <p>
                  <Link
                    to="/dealer-login"
                    className="text-decoration-none text-success"
                  >
                    Back to dealer login
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
