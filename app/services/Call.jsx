import Axios from "axios";

// Get API URL - use proxy when on client side to avoid CORS
const getApiUrl = () => {
  // If environment variable is set, use it
  const envApi = process.env.NEXT_PUBLIC_API_KEY || process.env.REACT_APP_API_KEY;
  if (envApi) {
    return envApi;
  }
  
  // On client side, use proxy to avoid CORS issues
  if (typeof window !== 'undefined') {
    return '/api/';
  }
  
  // On server side, use direct URL (no CORS on server)
  return 'https://admin.impel.store/api/';
};

export default function call({ path, method, data }) {
  // Get API URL dynamically to handle client/server differences
  const api = getApiUrl();
  
  return new Promise((resolve, reject) => {
    const config = {
      url: api + path,
      method,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: false,
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
