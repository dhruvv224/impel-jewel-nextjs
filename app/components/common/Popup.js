import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "reactstrap";
import ringJewelley from "../../assets/images/engagement-ring_7354745.png";
import { FaTimes } from "react-icons/fa";

const Popup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(() => {
    const storedState = localStorage.getItem("showPopup");
    return storedState ? JSON.parse(storedState) : true; // Default to true if not set
  });

  useEffect(() => {
    localStorage.setItem("showPopup", JSON.stringify(showPopup));
    localStorage.setItem("redirectPath", location.pathname);
  }, [showPopup, location.pathname]);

  useEffect(() => {
    if (!showPopup) return; // Do nothing if popup is closed manually

    const timeout = setTimeout(() => {
      setShowPopup(true);
    }, 60000);

    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem("showPopup", JSON.stringify(false));
  };

  const handleLogin = () => {
navigate('/login', { state: { from: location.pathname } });
    handleClose();
  };

  return (
    <>
      <Modal
        isOpen={showPopup}
        backdrop="static"
        keyboard={false}
        scrollable={true}
        centered={true}
        className="login_model_main"
      >
        <div className="position-relative">
          <button
            className="position-absolute bg-white"
            style={{
              top: "5px",
              right: "10px",
              border: "none",
              fontSize: "1.5rem",
            }}
            onClick={handleClose}
          >
            <FaTimes />
          </button>
        </div>
        <div className="row">
          <div className="col-md-6 p-0 d-none d-md-block">
            <div className="newsletter-popup__bg">
              <img
                src="https://uomo-nextjs-ecommerce.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fnewsletter-popup.jpg&w=640&q=75"
                alt="image"
                className="w-100 h-100"
              />
            </div>
          </div>
          <div className="col-md-6 p-4 d-flex align-items-center text-center">
            <div className="block-newsletter">
              <img src={ringJewelley} alt="image" className="w-25 mb-4" />
              <h5 className="block__title">
                Connect with Direct Manufacturer & Get Lifetime Plating on All
                Our Jewellery!
              </h5>
              <p className="my-4">
                Unlock exclusive discounts by logging in to your account. Don't
                miss out on special deals and offers!
              </p>
              <button className="model_login_button" onClick={handleLogin}>
                Login to Access Discounts
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Popup;
