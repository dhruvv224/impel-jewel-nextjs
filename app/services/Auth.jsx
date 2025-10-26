import Call from "./Call";

const dealerLogin = async (data) => {
  let d = await Call({
    path: "user-login",
    method: "post",
    data,
  });
  return d;
};

const otpLogin = async (data) => {
  let d = await Call({
    path: "send-otp-login",
    method: "post",
    data,
  });
  return d;
};

const otpVerify = async (data) => {
  let d = await Call({
    path: "login-with-otp",
    method: "post",
    data,
  });
  return d;
};

const checkUser = async (data) => {
  let d = await Call({
    path: "login",
    method: "post",
    data,
  });
  return d;
};

const profile = async (data) => {
  let d = await Call({
    path: "profile",
    method: "post",
    data,
  });
  return d;
};

const getProfile = async (data) => {
  let d = await Call({
    path: "user-profile",
    method: "post",
    data,
  });
  return d;
};

const updateProfile = async (data) => {
  let d = await Call({
    path: "update-user-profile",
    method: "post",
    data,
  });
  return d;
};

const forget = async (data) => {
  let d = await Call({
    path: `forgotPassword?${data}`,
    method: "get",
    data,
  });
  return d;
};

const addtoWishlist = async (data) => {
  let d = await Call({
    path: "add-user-wishlist",
    method: "post",
    data,
    enctype: "multipart/form-data",
  });
  return d;
};

const userWishlist = async (data) => {
  let d = await Call({
    path: "user-wishlist",
    method: "post",
    data,
    enctype: "multipart/form-data",
  });
  return d;
};

const UserProfileImage = async (data) => {
  let d = await Call({
    path: "upload-user-image",
    method: "post",
    data,
    enctype: "multipart/form-data",
  });
  return d;
};

const removetoWishlist = async (data) => {
  let d = await Call({
    path: "remove-user-wishlist",
    method: "post",
    data,
    enctype: "multipart/form-data",
  });
  return d;
};

const getCity = async (data) => {
  let d = await Call({
    path: "state/cities",
    method: "post",
    data,
  });
  return d;
};

const exportObject = {
  userWishlist,
  removetoWishlist,
  addtoWishlist,
  dealerLogin,
  checkUser,
  UserProfileImage,
  updateProfile,
  profile,
  forget,
  getProfile,
  getCity,
  otpLogin,
  otpVerify
};

export default exportObject;
