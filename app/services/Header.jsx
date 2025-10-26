export default function authHeader(headerType) {
  const token = localStorage.getItem("accessToken");
  if (token) {
    // for Node.js Express back-end
    if (headerType === "") {
      return {
        Authorization: "Bearer " + token,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
      };
    } else if (headerType === "multipart") {
      return {
        Authorization: "Bearer " + token,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "Content-type": "multipart/form-data",
      };
    }
  } else {
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "X-Requested-With",
    };
  }
}
