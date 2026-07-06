import { createContext, useContext, useState, useEffect } from "react";
import { getCookie, setCookie, removeCookie } from "../utils/cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = getCookie("jwt_token");
    const savedRole = getCookie("jwt_role");
    const savedUser = getCookie("jwt_user");

    if (savedToken && savedRole && savedUser) {
      try {
        setToken(savedToken);
        setRole(savedRole);
        setUser(JSON.parse(savedUser));
      } catch {
        removeCookie("jwt_token");
        removeCookie("jwt_role");
        removeCookie("jwt_user");
      }
    }
    setLoading(false);
  }, []);

  const login = (tokenValue, roleValue, userObj) => {
    removeCookie("jwt_token");
    removeCookie("jwt_role");
    removeCookie("jwt_user");
    setToken(tokenValue);
    setRole(roleValue);
    setUser(userObj);
    setCookie("jwt_token", tokenValue, 1);
    setCookie("jwt_role", roleValue, 1);
    setCookie("jwt_user", JSON.stringify(userObj), 1);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    removeCookie("jwt_token");
    removeCookie("jwt_role");
    removeCookie("jwt_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
