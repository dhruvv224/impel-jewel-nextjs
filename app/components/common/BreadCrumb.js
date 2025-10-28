import React from "react";
import { Breadcrumb } from "react-bootstrap";
import Link from "next/link";

const BreadCrumb = (props) => {
  return (
    <div className="breadCrumb">
      <Breadcrumb>
        {props.firstName && (
          <Breadcrumb.Item>
            <Link href={props.firstUrl || "#"}>{props.firstName}</Link>
          </Breadcrumb.Item>
        )}
        {props.secondName && (
          <Breadcrumb.Item>
            <Link href={props.secondUrl || "#"}>{props.secondName}</Link>
          </Breadcrumb.Item>
        )}
        {props.thirdName && (
          <Breadcrumb.Item active>{props.thirdName}</Breadcrumb.Item>
        )}
      </Breadcrumb>
    </div>
  );
};

export default BreadCrumb;
