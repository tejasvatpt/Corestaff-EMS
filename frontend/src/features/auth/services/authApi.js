import api, { setToken, clearToken } from "@/lib/api";

// Exchange credentials for a JWT and store it. The interceptor in lib/api.js
// picks the token up on every subsequent request.
export const login = async (email, password) => {
  const response = await api.post("/users/login", { email, password });
  const { access_token } = response.data;

  setToken(access_token);

  return access_token;
};

export const logout = () => {
  clearToken();
};

// Resolve the current user from the stored token. Used to restore a session on
// page reload and to learn the user's role.
export const getMe = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.post("/users/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return response.data;
};
