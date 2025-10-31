import React from "react";
import { Breadcrumb } from "react-bootstrap";
import Link from "next/link";

const BreadCrumb = (props) => {
  return (
    <div className="breadCrumb">
      <Breadcrumb>
        {props.firstName && (
          <li className="breadcrumb-item">
            {props.firstUrl ? (
              <Link href={props.firstUrl} className="text-decoration-none">
                {props.firstName}
              </Link>
            ) : (
              props.firstName
            )}
          </li>
        )}
        {props.secondName && (
          <li className="breadcrumb-item">
            {props.secondUrl ? (
              <Link href={props.secondUrl} className="text-decoration-none">
                {props.secondName}
              </Link>
            ) : (
              props.secondName
            )}
          </li>
        )}
        {props.thirdName && (
          <li className="breadcrumb-item active" aria-current="page">
            {props.thirdName}
          </li>
        )}
      </Breadcrumb>
    </div>
  );
};

export default BreadCrumb;
