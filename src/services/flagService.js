import api, { toServiceError } from "../api/api";

const buildFlagPayload = (userId, reason) => {
  const normalizedUserId = Number(userId);

  return {
    userId: Number.isFinite(normalizedUserId) ? normalizedUserId : userId,
    reason,
  };
};

export const flagSeller = async (userId, reason) => {
  try {
    const response = await api.post("/api/flag/seller", buildFlagPayload(userId, reason));
    return response.data;
  } catch (error) {
    throw toServiceError(error, "Unable to flag seller.");
  }
};

export const flagBuyer = async (userId, reason) => {
  try {
    const response = await api.post("/api/flag/buyer", buildFlagPayload(userId, reason));
    return response.data;
  } catch (error) {
    throw toServiceError(error, "Unable to flag buyer.");
  }
};
