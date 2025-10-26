import call from "../Call";

const ForgetPassword = async (data) => {
  let d = await call({
    path: "forget-password",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const ResetPassword = async (data) => {
  let d = await call({
    path: "reset-password",
    method: "POST",
    enctype: "multipart/form-data",
    data,
  });
  return d;
};

const exportObject = { ForgetPassword, ResetPassword };

export default exportObject;
