import axiosInstance from "@/shared/APIs/axiosInstance";

export async function getAdminUsersApi(params?: {
  role?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const response = await axiosInstance.get("/admin/users", { params });
  return response.data?.data || response.data;
}
