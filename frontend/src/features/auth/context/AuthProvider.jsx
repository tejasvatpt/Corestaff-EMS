import { useEffect, useState, useCallback } from "react";

import { getToken, clearToken } from "@/lib/api";
import {
  login as loginRequest,
  getMe,
} from "../services/authApi";
import { AuthContext } from "./authContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, if a token is present, try to restore the session. A failure
  // (expired/invalid token) just leaves us logged out.
  useEffect(() => {
    const restore = async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        const me = await getMe();
        setUser(me);
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);

  const login = useCallback(async (email, password) => {
    await loginRequest(email, password);
    const me = await getMe();
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
