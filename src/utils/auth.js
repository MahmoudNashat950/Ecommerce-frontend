import { jwtDecode } from "jwt-decode";

const ROLE_CLAIM_KEYS = [
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  "role",
  "roles",
  "roleName",
];

const USER_ID_CLAIM_KEYS = ["sub", "nameid", "id", "userId"];

const pickFirstValue = (value) => {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
};

export const normalizeRole = (role) => {
  const rawRole = pickFirstValue(role);

  if (typeof rawRole !== "string") {
    return null;
  }

  return rawRole.trim().toLowerCase() || null;
};

export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const getStoredRole = () => normalizeRole(localStorage.getItem("role"));

export const setStoredRole = (role) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole) {
    localStorage.setItem("role", normalizedRole);
    return;
  }

  localStorage.removeItem("role");
};

export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

export const decodeToken = () => {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

const readClaim = (decoded, keys) => {
  if (!decoded) {
    return null;
  }

  for (const key of keys) {
    if (decoded[key] !== undefined && decoded[key] !== null) {
      return decoded[key];
    }
  }

  return null;
};

export const getUserRole = () => {
  const decoded = decodeToken();
  const tokenRole = normalizeRole(readClaim(decoded, ROLE_CLAIM_KEYS));

  return tokenRole || getStoredRole();
};

export const getUserId = () => {
  const decoded = decodeToken();
  return pickFirstValue(readClaim(decoded, USER_ID_CLAIM_KEYS));
};
