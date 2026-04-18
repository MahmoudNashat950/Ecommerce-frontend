import api, { toServiceError } from "../api/api";

export const flagSeller = async (sellerId, reason) => {
  try {
    const response = await api.post("/api/flag/seller", { sellerId, reason });
    return response.data;
  } catch (error) {
    throw toServiceError(error, "Unable to flag seller.");
  }
};

export const flagBuyer = async (buyerId, reason) => {
  try {
    const response = await api.post("/api/flag/buyer", { buyerId, reason });
    return response.data;
  } catch (error) {
    throw toServiceError(error, "Unable to flag buyer.");
  }
};
