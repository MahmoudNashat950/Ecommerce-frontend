import api, { toServiceError } from "../api/api";

const extractCollection = (payload, collectionKeys = []) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  for (const key of collectionKeys) {
    if (Array.isArray(payload?.[key])) {
      return payload[key];
    }
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

export const getAdminUsers = async () => {
  try {
    const response = await api.get("/api/admin/users");
    return extractCollection(response.data, ["users", "results"]);
  } catch (error) {
    throw toServiceError(error, "Unable to load users.");
  }
};

export const banAdminUser = async (userId) => {
  try {
    const response = await api.post(`/api/admin/users/${userId}/ban`);
    return response.data ?? null;
  } catch (error) {
    throw toServiceError(error, "Unable to ban this user.");
  }
};

export const unbanAdminUser = async (userId) => {
  try {
    const response = await api.post(`/api/admin/users/${userId}/unban`);
    return response.data ?? null;
  } catch (error) {
    throw toServiceError(error, "Unable to unban this user.");
  }
};

export const deleteAdminUser = async (userId) => {
  try {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data ?? null;
  } catch (error) {
    throw toServiceError(error, "Unable to delete this user.");
  }
};

export const getAdminReports = async () => {
  try {
    const response = await api.get("/api/admin/reports");
    return extractCollection(response.data, ["reports", "results"]);
  } catch (error) {
    throw toServiceError(error, "Unable to load reports.");
  }
};
