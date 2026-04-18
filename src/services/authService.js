import api, { toServiceError } from "../api/api";
import { setToken, clearToken } from "../utils/auth";

export const login = async (email, password) => {
  try {
    const response = await api.post("/api/Auth/login", { email, password });
    const token = response?.data?.token;

    if (!token) {
      throw new Error(response?.data?.message || "Login failed");
    }

    setToken(token);
    return response.data;
  } catch (error) {
    throw toServiceError(error, "Unable to log in.");
  }
};

export const register = async (name, email, password, role) => {
  try {
    const response = await api.post("/api/Auth/register", {
      name,
      email,
      password,
      role,
    });

    return response.data;
  } catch (error) {
    throw toServiceError(error, "Unable to register.");
  }
};

export const logout = () => {
  clearToken();
};
