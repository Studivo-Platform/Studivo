import axiosInstance from "@/shared/APIs/axiosInstance";
import { Request } from "../types/Request.type";

export async function getRequestsApi(): Promise<Request[]> {
  try {
    const response = await axiosInstance.get("/requests/my");
    const data = response.data?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.requests)) return data.requests;
    if (Array.isArray(data?.docs)) return data.docs;
    if (Array.isArray(response.data?.docs)) return response.data.docs;
    if (Array.isArray(response.data?.requests)) return response.data.requests;
    if (Array.isArray(response.data)) return response.data;
    return [];
  } catch (error) {
    console.error("Error fetching student requests:", error);
    return [];
  }
}