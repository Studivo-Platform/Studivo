import axiosInstance from "@/shared/APIs/axiosInstance";

export async function getAdminOffersApi(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const response = await axiosInstance.get("/admin/offers", { params });
  return response.data?.data || response.data;
}
