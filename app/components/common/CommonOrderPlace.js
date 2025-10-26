import React, { useEffect } from "react";
import Loading from "./Loader";
import "./Loader.css";
import { useLocation } from "react-router-dom";

const CommonOrderPlace = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname == "/processing-order") {
    }
  }, [location]);

  return (
    <>
      <Loading />
    </>
  );
};

export default CommonOrderPlace;
