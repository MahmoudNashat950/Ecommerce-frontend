import api, { toServiceError } from "../api/api";

export const getCategories = async () => {
  try {
    const response = await api.get("/api/Categories");
    return response.data;
  } catch (error) {
    throw toServiceError(error, "Failed to load categories.");
  }
};

export const createCategory = async (name) => {
  try {
    const response = await api.post("/api/Categories", { name });
    return response.data;
  } catch (error) {
    throw toServiceError(error, "Failed to create category.");
  }
};
