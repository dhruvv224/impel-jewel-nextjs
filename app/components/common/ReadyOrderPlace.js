import React, { useEffect } from "react";
import Loading from "./Loader";
import "./Loader.css";
import { useLocation } from "react-router-dom";

const ReadyOrderPlace = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname == "/ready-processing-order") {
    }
  }, [location]);

  return (
    <>
      <Loading />
    </>
  );
};

export default ReadyOrderPlace;
