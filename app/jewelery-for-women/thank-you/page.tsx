import React from "react";
import { Helmet } from "react-helmet-async";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";

const ThankYou = () => {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Impel Store - Thank you...</title>
      </Helmet>
      <div className="thank-modal">
        <div className="modal-content">
          <div className="text-center">
            <div className="icon-wrapper">
              <img src={Logo} alt="logo" height={70} />
            </div>
            <h3 className="modal-title">Thank You!</h3>
            <p className="modal-message">
              We have received your message and will get back to you soon. While
              you wait, feel free to explore the resources below or return to
              the homepage.
            </p>
            <button
              className="modal-close-btn"
              onClick={() => navigate("/jewelery-for-women")}
            >
              <FaLongArrowAltLeft
                className="me-2"
                style={{ fontSize: "20px" }}
              />
              Back to Page
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThankYou;
