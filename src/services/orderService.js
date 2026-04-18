import api, { toServiceError } from "../api/api";

// ================= HELPER: ENSURE ARRAY RESPONSE =================
const ensureArray = (data) => {
  if (data === null || data === undefined) return [];
  return Array.isArray(data) ? data : [];
};

// ================= BUYER OPERATIONS =================
export const createOrder = async (data) => {
  try {
    const res = await api.post("/api/order", data);
    return res.data || null;
  } catch (error) {
    throw toServiceError(error, "Failed to create order.");
  }
};

export const getBuyerOrders = async () => {
  try {
    const res = await api.get("/api/order/my");
    // Handle null data response from backend
    return ensureArray(res.data);
  } catch (error) {
    // If backend returns 200 OK with null data, return empty array
    if (error?.response?.status === 200) {
      return [];
    }
    throw toServiceError(error, "Unable to load orders.");
  }
};

export const getMyOrders = async () => {
  return getBuyerOrders();
};

export const addOrderComment = async (orderId, text) => {
  try {
    const res = await api.post(`/api/order/${orderId}/comments`, {
      text,
    });
    return res.data;
  } catch (error) {
    throw toServiceError(error, "Failed to add comment.");
  }
};

export const getOrderComments = async (orderId) => {
  try {
    const res = await api.get(`/api/order/${orderId}/comments`);
    return ensureArray(res.data);
  } catch (error) {
    // If endpoint doesn't exist, return empty array
    if (error?.response?.status === 404) {
      return [];
    }
    throw toServiceError(error, "Failed to load order comments.");
  }
};

// ================= SELLER OPERATIONS =================
export const getSellerOrders = async () => {
  try {
    const res = await api.get("/api/order/seller");
    // Handle null data response from backend
    return ensureArray(res.data);
  } catch (error) {
    // If backend returns 200 OK with null data, return empty array
    if (error?.response?.status === 200) {
      return [];
    }
    throw toServiceError(error, "Unable to load seller orders.");
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const res = await api.put(`/api/order/${id}/status`, { status });
    return res.data;
  } catch (error) {
    throw toServiceError(error, "Failed to update order status.");
  }
};