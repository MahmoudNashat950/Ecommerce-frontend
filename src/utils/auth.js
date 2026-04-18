import { jwtDecode } from "jwt-decode";

export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const clearToken = () => localStorage.removeItem("token");

export const decodeToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const getUserRole = () => {
  const decoded = decodeToken();
  return decoded?.role || decoded?.roles || decoded?.roleName || null;
};

export const getUserId = () => {
  const decoded = decodeToken();
  return decoded?.sub || decoded?.nameid || decoded?.id || decoded?.userId || null;
};
