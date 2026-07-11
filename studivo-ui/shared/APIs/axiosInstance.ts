import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/shared/store/auth.store";
import { disconnectSocket } from "@/shared/lib/socket";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const clearToken = (): void => {
  useAuthStore.getState().logout();
  disconnectSocket();
  if (typeof window !== "undefined") {
    document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  }
};

export const performLogout = async (): Promise<void> => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch {
    // Ignore errors if token already invalidated
  } finally {
    clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data?.data?.accessToken || res.data?.accessToken;
        if (newToken) {
          useAuthStore.getState().setAccessToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        clearToken();
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;