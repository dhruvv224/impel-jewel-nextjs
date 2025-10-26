import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import errorimage from "../assets/images/404-page-removebg-preview.png";

const Errorpage = () => {
  return (
    <>
      <Helmet>
        <title>Impel Store - Not found URL</title>
      </Helmet>
      <div className="container">
        <div className="utility-page-wrap">
          <div className="utility-page-content">
            <img src={errorimage} alt="" className="w-100" />
            <h3>Page Not Found</h3>
            <div className="error-description">
              The page you are looking for doesn't exist or has been moved
            </div>
            <Link to="/" className="dark-button w-button">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Errorpage;
