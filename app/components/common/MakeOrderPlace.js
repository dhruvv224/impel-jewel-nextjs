import React, { useEffect } from "react";
import Loading from "./Loader";
import "./Loader.css";
import { useLocation } from "react-router-dom";

const MakeOrderPlace = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname == "/processing-order") {
    }
  }, [location]);
  return (
    <div>
      <Loading />
    </div>
  );
};

export default MakeOrderPlace;
