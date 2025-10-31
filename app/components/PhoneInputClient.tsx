"use client";

import React from "react";
import PhoneInput, { PhoneInputProps } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneInputClient: React.FC<PhoneInputProps> = (props) => {
  return <PhoneInput {...props} />;
};

export default PhoneInputClient;
