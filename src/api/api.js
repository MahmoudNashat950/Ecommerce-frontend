import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5213/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            return Promise.reject({
                message:
                    "Network error: could not reach the backend. Check that http://localhost:5269 is running and that CORS is configured for http://localhost:3000.",
            });
        }

        return Promise.reject(error);
    }
);

export const getApiErrorMessage = (error, fallbackMessage) =>
    error?.response?.data?.message ||
    error?.response?.data?.title ||
    error?.message ||
    fallbackMessage;

export const toServiceError = (error, fallbackMessage) => {
    const wrappedError = new Error(getApiErrorMessage(error, fallbackMessage));

    if (error?.response) {
        wrappedError.response = error.response;
        wrappedError.status = error.response.status;
    }

    return wrappedError;
};

export default api;
