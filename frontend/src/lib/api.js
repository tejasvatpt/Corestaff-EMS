import axios from "axios";

// Single axios instance for the whole app. Base URL matches the CORS origins
// allowed in app/main.py.
const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const TOKEN_KEY = "ems_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Attach the bearer token to every request when we have one.
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// On 401 the token is missing/expired/invalid: drop it and send the user to
// login. Skip the redirect for the login call itself so a wrong password shows
// an inline error instead of a page reload.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const isLoginRequest = url.includes("/users/login");

    if (status === 401 && !isLoginRequest) {
      clearToken();

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
