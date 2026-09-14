import axios from "axios";

// const BASE_URL = "https://ml-55od.onrender.com";
// const BASE_URL = "https://api.dtfindia.org";
// const BASE_URL = "http://13.234.231.216:8002/"
// const BASE_URL = "https://mlm-gules.vercel.app/"
const BASE_URL = "http://localhost:8002";  // local testing — backend on port 8002




const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers["Authorization"] = `${token}`;``
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getRequest = (endpoint, params = {}) => {
  return api.get(endpoint, { params });
};

export const postRequest = (endpoint, data) => {
  return api.post(endpoint, data);
};

export const putRequest = (endpoint, data) => {
  return api.put(endpoint, data);
};

export const deleteRequest = (endpoint) => {
  return api.delete(endpoint);
};

const getUserId = (id) => {
  
  if (!id) return `#DTF000`;
  return `#DTF00${id}`;
};

function extractNumber(str) {
  const match = str.match(/\d+/); // Matches continuous digits
  if (match) {
    return parseInt(match[0], 10); // Converts "002" to 2
  }
  return null;
}

export { getUserId, extractNumber };
