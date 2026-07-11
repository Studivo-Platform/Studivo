import axiosInstance from "@/shared/APIs/axiosInstance";

export async function getAdminStatsApi() {
  const response = await axiosInstance.get("/admin/stats");
  return response.data?.data || response.data;
}
