import React, { useState } from "react";
import "./WomansClub.css";
import homeService from "../../services/Home";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer } from "antd";

const WomansClub = () => {
  const [open, setOpen] = useState(false);

  const [details, setDetails] = useState({
    fullName: "",
    number: "",
    email: "",
    city: "",
    message: "",
  });

  const [isChecked, setIsChecked] = useState({
    instagram: false,
    facebook: false,
    pinterest: false,
    friend_or_family: false,
    our_exibitions: false,
    our_any_campaign: false,
  });

  const [errors, setErrors] = useState({});
  const [spinner, setSpinner] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setIsChecked({ ...isChecked, [name]: checked });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!details.fullName.trim()) {
      newErrors.fullName = "Full name is required!";
      valid = false;
    }

    if (!details.number.trim()) {
      newErrors.number = "Mobile number is required!";
      valid = false;
    } else if (details.number.length !== 10 || isNaN(details.number)) {
      newErrors.number = "Your mobile number should be 10 digits!";
      valid = false;
    }

    if (!details.email.trim()) {
      newErrors.email = "Email is required!";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(details.email)) {
      newErrors.email = "Email is invalid!";
      valid = false;
    }

    if (!details.city.trim()) {
      newErrors.city = "City is required!";
      valid = false;
    }

    // if (details.message && details.message.length < 50) {
    //   newErrors.message = "Message must contain at least 50 characters!";
    //   valid = false;
    // }

    if (
      !(
        isChecked.instagram ||
        isChecked.facebook ||
        isChecked.pinterest ||
        isChecked.friend_or_family ||
        isChecked.our_exibitions ||
        isChecked.our_any_campaign
      )
    ) {
      newErrors.checkbox = "Please select at least one option!";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSpinner(true);
      let formdata = new FormData();
      formdata.append("name", details.fullName);
      formdata.append("mobile", details.number);
      formdata.append("email", details.email);
      formdata.append("city", details.city);
      formdata.append(
        "how_you_know",
        Object.keys(isChecked).filter((key) => isChecked[key])
      );
      formdata.append("message", details.message);

      const requestData = {
        name: details.fullName,
        mobile: details.number,
        email: details.email,
        city: details.city,
        how_you_know: Object.keys(isChecked).filter((key) => isChecked[key]),
        message: details.message,
      };

      homeService
        .WomansJoin(requestData)
        .then((res) => {
          if (res?.status === true) {
            toast.success(res?.message);
            setSpinner(false);
            setOpen(false);
            setDetails({
              fullName: "",
              number: "",
              email: "",
              city: "",
              message: "",
            });
            setIsChecked({
              instagram: false,
              facebook: false,
              pinterest: false,
              friend_or_family: false,
              our_exibitions: false,
              our_any_campaign: false,
            });
            setErrors({});
          }
        })
        .catch((err) => console.log(err))
        .finally(() => setSpinner(false));
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setDetails({
      fullName: "",
      number: "",
      email: "",
      city: "",
      message: "",
    });
    setIsChecked({
      instagram: false,
      facebook: false,
      pinterest: false,
      friend_or_family: false,
      our_exibitions: false,
      our_any_campaign: false,
    });
    setErrors({});
  };

  return (
    <>
      <button className="womans-toggle" onClick={showDrawer}>
        Join our buddies club<span className="top"></span>
        <span className="right"></span>
        <span className="bottom"></span>
        <span className="left"></span>
      </button>
      <Drawer
        title="Contact information"
        placement="left"
        closable
        onClose={onClose}
        open={open}
        width={550}
        className="join_our_women_club"
        maskClosable={false}
        closeIcon={<CloseOutlined />}
      >
        <>
          <div className="text-center" style={{ fontSize: "15px" }}>
            PLEASE PROVIDE INFORMATION AND WE WILL GET BACK TO YOU SOON
          </div>
          <div className="mt-3">
            <section id="contact-us" className="contact-us">
              <div className="">
                <div className="contact-main">
                  <div className="contact_box">
                    <div className="contact_form">
                      <form id="joinForm" onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group position-relative">
                              <label htmlFor="fullName" className="form-label">
                                Full Name
                              </label>
                              <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                className={`form-control ${
                                  errors.fullName ? "is-invalid" : ""
                                }`}
                                placeholder="Enter full name"
                                value={details.fullName}
                                onChange={handleChange}
                              />
                              {errors.fullName && (
                                <div className="invalid-feedback">
                                  {errors.fullName}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="form-group position-relative">
                              <label htmlFor="mobileNumber">
                                Mobile Number (whatsapp)
                              </label>
                              <input
                                type="tel"
                                name="number"
                                id="mobileNumber"
                                className={`form-control ${
                                  errors.number ? "is-invalid" : ""
                                }`}
                                placeholder="Enter mobile number"
                                value={details.number}
                                onChange={handleChange}
                                maxLength="10"
                                minLength="10"
                              />
                              {errors.number && (
                                <div className="invalid-feedback">
                                  {errors.number}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="form-group position-relative">
                              <label htmlFor="email">Email</label>
                              <input
                                type="text"
                                name="email"
                                id="email"
                                className={`form-control ${
                                  errors.email ? "is-invalid" : ""
                                }`}
                                placeholder="Enter email"
                                value={details.email}
                                onChange={handleChange}
                              />
                              {errors.email && (
                                <div className="invalid-feedback">
                                  {errors.email}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="form-group position-relative">
                              <label htmlFor="city">City</label>
                              <input
                                type="text"
                                name="city"
                                id="city"
                                className={`form-control ${
                                  errors.city ? "is-invalid" : ""
                                }`}
                                placeholder="Enter city"
                                value={details.city}
                                onChange={handleChange}
                              />
                              {errors.city && (
                                <div className="invalid-feedback">
                                  {errors.city}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="form-group position-relative">
                              <label>How You Know About Us ?</label>
                              <div className="row">
                                <div className="col-md-5 col-5">
                                  <div className="checkbox-wrapper-42">
                                    <input
                                      id="instagram"
                                      name="instagram"
                                      type="checkbox"
                                      checked={isChecked.instagram}
                                      onChange={handleCheckboxChange}
                                    />
                                    <label
                                      className="cbx"
                                      htmlFor="instagram"
                                    ></label>
                                    <label className="lbl" htmlFor="instagram">
                                      Instagram
                                    </label>
                                  </div>

                                  <div className="checkbox-wrapper-42">
                                    <input
                                      id="facebook"
                                      name="facebook"
                                      type="checkbox"
                                      checked={isChecked.facebook}
                                      onChange={handleCheckboxChange}
                                    />
                                    <label
                                      className="cbx"
                                      htmlFor="facebook"
                                    ></label>
                                    <label className="lbl" htmlFor="facebook">
                                      Facebook
                                    </label>
                                  </div>
                                  <div className="checkbox-wrapper-42">
                                    <input
                                      id="pinterest"
                                      name="pinterest"
                                      type="checkbox"
                                      checked={isChecked.pinterest}
                                      onChange={handleCheckboxChange}
                                    />
                                    <label
                                      className="cbx"
                                      htmlFor="pinterest"
                                    ></label>
                                    <label className="lbl" htmlFor="pinterest">
                                      Pinterest
                                    </label>
                                  </div>
                                </div>
                                <div className="col-md-7 col-7">
                                  <div className="checkbox-wrapper-42">
                                    <input
                                      id="family"
                                      name="friend_or_family"
                                      type="checkbox"
                                      checked={isChecked.friend_or_family}
                                      onChange={handleCheckboxChange}
                                    />
                                    <label
                                      className="cbx"
                                      htmlFor="family"
                                    ></label>
                                    <label className="lbl" htmlFor="family">
                                      Friend or family
                                    </label>
                                  </div>
                                  <div className="checkbox-wrapper-42">
                                    <input
                                      id="exibitions"
                                      name="our_exibitions"
                                      type="checkbox"
                                      checked={isChecked.our_exibitions}
                                      onChange={handleCheckboxChange}
                                    />
                                    <label
                                      className="cbx"
                                      htmlFor="exibitions"
                                    ></label>
                                    <label className="lbl" htmlFor="exibitions">
                                      Our Exibitions
                                    </label>
                                  </div>
                                  <div className="checkbox-wrapper-42">
                                    <input
                                      id="campaign"
                                      name="our_any_campaign"
                                      type="checkbox"
                                      checked={isChecked.our_any_campaign}
                                      onChange={handleCheckboxChange}
                                    />
                                    <label
                                      className="cbx"
                                      htmlFor="campaign"
                                    ></label>
                                    <label className="lbl" htmlFor="campaign">
                                      Our any campaign
                                    </label>
                                  </div>
                                </div>
                              </div>
                              {errors.checkbox && (
                                <div
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: "400",
                                    color: "#FF0000",
                                  }}
                                >
                                  {errors.checkbox}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="form-group position-relative">
                              <label htmlFor="message">
                                If Any Special Request ?
                              </label>
                              <textarea
                                name="message"
                                id="message"
                                className={`form-control ${
                                  errors.message ? "is-invalid" : ""
                                }`}
                                rows="5"
                                placeholder="Enter message"
                                value={details.message}
                                onChange={handleChange}
                                style={{ resize: "none", height: "auto" }}
                              ></textarea>
                              {errors.message && (
                                <div className="invalid-feedback">
                                  {errors.message}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="form-group text-center m-0">
                              <button className="sub-btn">
                                {spinner && (
                                  <CgSpinner
                                    size={20}
                                    className="animate_spin"
                                  />
                                )}
                                {spinner ? "" : "Submit"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </>
      </Drawer>
    </>
  );
};

export default WomansClub;
