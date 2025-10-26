import Axios from "axios";
const api = process.env.REACT_APP_API_KEY || 'https://admin.impel.store/api/';

export default function call({ path, method, data }) {
  return new Promise((resolve, reject) => {
    const config = {
      url: api + path,
      method,
      data,
    };

    Axios(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        let status = error?.response?.data?.status;
        let errorMessage =
          error?.response?.data?.message || "An error occurred.";

        if ([401, 403, 404].includes(status)) {
          reject(errorMessage);
        } else {
          reject(errorMessage);
        }
      });
  });
}
