import api, { toServiceError } from "../api/api";
import { normalizeProduct, normalizeProductList } from "../types/product";

// ================= GET ALL PRODUCTS =================
export const getProducts = async () => {
  try {
    const response = await api.get("/api/Product");
    // Handle null response from backend
    if (!response.data) return [];
    return normalizeProductList(response.data);
  } catch (error) {
    throw toServiceError(error, "Unable to load products.");
  }
};

// ================= SEARCH PRODUCTS =================
export const searchProducts = async (query) => {
  try {
    const response = await api.get(
      `/api/Product/search?query=${encodeURIComponent(query)}`
    );

    // Handle null response from backend
    if (!response.data) return [];
    return normalizeProductList(response.data);
  } catch (error) {
    throw toServiceError(error, "Unable to search products.");
  }
};

// ================= GET BY ID =================
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/api/Product/${id}`);
    // Handle null response from backend
    if (!response.data) {
      throw new Error("Product not found");
    }
    return normalizeProduct(response.data);
  } catch (error) {
    throw toServiceError(error, "Unable to load product details.");
  }
};

// ================= CREATE =================
export const createProduct = async (product) => {
  try {
    const response = await api.post("/api/Product", product);
    return response.data;
  } catch (error) {
    throw toServiceError(error, "Unable to create product.");
  }
};

// ================= UPDATE =================
export const updateProduct = async (id, product) => {
  try {
    const response = await api.put(`/api/Product/${id}`, product);
    return response.data;
  } catch (error) {
    throw toServiceError(error, "Unable to update product.");
  }
};

// ================= DELETE =================
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/api/Product/${id}`);
    return response.data;
  } catch (error) {
    throw toServiceError(error, "Unable to delete product.");
  }
};