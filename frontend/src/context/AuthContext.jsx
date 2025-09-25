import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  login: (_token) => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = (newToken) => {
    try {
      if (newToken) localStorage.setItem("token", newToken);
      setToken(newToken || null);
      // Dispatch a custom event so other parts can react immediately
      window.dispatchEvent(new Event("auth-changed"));
    } catch {
      // noop
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      setToken(null);
      window.dispatchEvent(new Event("auth-changed"));
    } catch {
      // noop
    }
  };

  // Sync across tabs and manual localStorage changes
  useEffect(() => {
    const sync = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", sync);
    window.addEventListener("auth-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth-changed", sync);
    };
  }, []);

  const value = useMemo(
    () => ({ isLoggedIn: Boolean(token), token, login, logout }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}











