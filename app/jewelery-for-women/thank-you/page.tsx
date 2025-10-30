"use client"; // 👈 Mark as a Client Component

import React from "react";
// Import Next.js specific components and hooks
import { useRouter } from "next/navigation"; // For navigation
import Image from "next/image"; // For optimized images
import Link from "next/link"; // Optional: if you prefer Link for static navigation
// Removed: import { Helmet } from "react-helmet-async";
// Removed: import { useNavigate } from "react-router-dom"; 
import { FaLongArrowAltLeft } from "react-icons/fa";
// Assuming Logo path is correct and it is a local file
import Logo from "../../assets/images/logo.png";

// You can export Metadata (App Router feature) from a separate server file 
// (e.g., in layout.jsx or page.jsx, if this component wasn't a client component).
// Since it is a client component, the <title> tag inside is a simple solution.

const ThankYou = () => {
  const router = useRouter(); // 👈 Use Next.js useRouter hook for imperative navigation

  const handleBackNavigation = () => {
    // 👈 Use router.push() for programmatic navigation
    router.push("/jewelery-for-women");
  };

  return (
    <>
      {/* Client-side equivalent for setting the page title */}
      <title>Impel Store - Thank you...</title>
      
      <div className="thank-modal">
        <div className="modal-content">
          <div className="text-center">
            <div className="icon-wrapper">
              {/* Use next/image component for local images */}
              <Image 
                src='/assets/images/logo.png' 
                alt="logo" 
                height={70} 
                // Next.js requires width property for non-layout fill images
                width={70} 
                priority // Since it's a critical image
              />
            </div>
            <h3 className="modal-title">Thank You!</h3>
            <p className="modal-message">
              We have received your message and will get back to you soon. While
              you wait, feel free to explore the resources below or return to
              the homepage.
            </p>
            <button
              className="modal-close-btn"
              onClick={handleBackNavigation} // 👈 Call the new navigation handler
            >
              <FaLongArrowAltLeft
                className="me-2"
                style={{ fontSize: "20px" }}
              />
              Back to Page
            </button>
            
            {/* Alternative using Link component for simple navigation: */}
            {/* <Link href="/jewelery-for-women" passHref>
                <button className="modal-close-btn">
                  <FaLongArrowAltLeft className="me-2" style={{ fontSize: "20px" }}/>
                  Back to Page
                </button>
            </Link> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ThankYou;