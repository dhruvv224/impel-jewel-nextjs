import React, { useEffect, useState } from "react";
import { FaAngleUp } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const GoTop = () => {
  const [backButton, setBackButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setBackButton(true);
      } else {
        setBackButton(false);
      }
    });
  }, []);

  const scrollup = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const whatsappTip = <Tooltip id="tooltip">Chat with us</Tooltip>;

  return (
    <>
      <div>
        <OverlayTrigger placement="top" overlay={whatsappTip}>
          <a
            href="https://wa.me/+918799619939"
            className="whatsapp-btn"
            target="_blank"
            rel="noreferrer"
            title="Chat with us"
          >
            <BsWhatsapp />
          </a>
        </OverlayTrigger>
      </div>
      <div>
        {backButton && (
          <button className="go-top-button" onClick={scrollup}>
            <FaAngleUp style={{ color: "#fff" }} />
          </button>
        )}
      </div>
    </>
  );
};

export default GoTop;
