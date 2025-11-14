import axios from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("currentUser");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAuthSession = (token, user) => {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("authToken", token);
  }
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
};

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const suppressRedirect =
      error.config && error.config.suppressRedirect;
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !suppressRedirect
    ) {
      clearAuthSession();
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

export async function fetchJSON(path, options = {}) {
  try {
    const { suppressRedirect, ...rest } = options;
    const response = await apiClient.request({
      url: path,
      method: rest.method || "GET",
      data:
        rest.data ??
        (rest.body && typeof rest.body === "string"
          ? JSON.parse(rest.body)
          : rest.body),
      params: rest.params,
      headers: rest.headers,
      suppressRedirect,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request failed";
    const err = new Error(message);
    err.status = error.response?.status;
    err.payload = error.response?.data;
    throw err;
  }
}
