import axiosInstance from "@/shared/APIs/axiosInstance";

export async function getAdminRequestsApi(params?: {
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  const response = await axiosInstance.get("/admin/requests", { params });
  return response.data?.data || response.data;
}
