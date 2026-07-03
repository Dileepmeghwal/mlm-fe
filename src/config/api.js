import axios from "axios";

// Configure the API base URL via the VITE_API_BASE_URL env var (see .env).
// Falls back to localhost for local development.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8002";

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
      config.headers["Authorization"] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// On an expired/invalid session, clear the token and send the user back to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }
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
  // Zero-pad to at least 3 digits: 2 -> #DTF002, 1234 -> #DTF1234
  return `#DTF${String(id).padStart(3, "0")}`;
};

function extractNumber(str) {
  const match = str.match(/\d+/); // Matches continuous digits
  if (match) {
    return parseInt(match[0], 10); // Converts "002" to 2
  }
  return null;
}

export { getUserId, extractNumber };
