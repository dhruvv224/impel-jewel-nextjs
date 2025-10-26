import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";

const BreadCrumb = (props) => {
  return (
    <div className="breadCrumb">
      <Breadcrumb>
        {props.firstName && (
          <Breadcrumb.Item>
            <Link to={props.firstUrl}>{props.firstName}</Link>
          </Breadcrumb.Item>
        )}
        {props.secondName && (
          <Breadcrumb.Item>
            <Link to={props.secondUrl}>{props.secondName}</Link>
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
