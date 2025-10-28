import React from "react";
import Head from "next/head"; // Replaced Helmet from 'react-helmet-async'
import Link from "next/link"; // Replaced Link from 'react-router-dom'

const Errorpage = () => {
  return (
    <>
      {/* Replaced Helmet with Next.js Head component */}
      <Head>
        <title>Impel Store - Not found URL</title>
      </Head>
      <div className="container">
        <div className="utility-page-wrap">
          <div className="utility-page-content">
            <img src='/assets/images/404-page-removebg-preview.png' alt="404 Error Page" className="w-100" />
            <h3>Page Not Found</h3>
            <div className="error-description">
              The page you are looking for doesn't exist or has been moved
            </div>
            {/* Replaced <Link to="/"> with <Link href="/"> */}
            <Link href="/" className="dark-button w-button">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Errorpage;
