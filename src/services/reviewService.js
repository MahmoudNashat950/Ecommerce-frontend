import api, { toServiceError } from "../api/api";

// ================= CREATE REVIEW =================
export const createReview = async (data) => {
  try {
    const response = await api.post("/api/review", data);
    return response.data;
  } catch (error) {
    throw toServiceError(error, "Unable to submit review.");
  }
};

// ================= GET REVIEWS BY PRODUCT =================
export const getReviewsByProduct = async (productId) => {
  try {
    const response = await api.get(`/api/review/product/${productId}`);
    // Handle null response from backend
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    // Return empty array if API returns 200 OK with null
    if (error?.response?.status === 200) {
      return [];
    }
    throw toServiceError(error, "Unable to load product reviews.");
  }
};

// ================= GET SUMMARY =================
export const getReviewSummary = async (productId) => {
  try {
    const response = await api.get(`/api/review/summary/${productId}`);
    // Ensure null responses are handled gracefully
    if (!response.data) {
      return {
        totalReviews: 0,
        averageRating: 0,
      };
    }
    return {
      totalReviews: Number(response.data.totalReviews ?? 0),
      averageRating: response.data.averageRating ?? 0,
      ...response.data, // Preserve other fields
    };
  } catch (error) {
    // Return empty summary if API fails
    if (error?.response?.status === 200) {
      return {
        totalReviews: 0,
        averageRating: 0,
      };
    }
    throw toServiceError(error, "Unable to load review summary.");
  }
};