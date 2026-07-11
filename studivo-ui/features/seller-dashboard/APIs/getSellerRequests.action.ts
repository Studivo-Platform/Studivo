import axiosInstance from "@/shared/APIs/axiosInstance";
import { SellerMatchingRequestItem } from "../types/sellerRequests.type";

export async function getSellerRequestsAction(): Promise<SellerMatchingRequestItem[]> {
  try {
    const response = await axiosInstance.get("/requests");
    const data = response.data?.data;

    // Backend returns paginated: { requests: [...], total, page, limit }
    if (Array.isArray(data?.requests)) return data.requests;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.docs)) return data.docs;
    if (Array.isArray(response.data?.requests)) return response.data.requests;
    if (Array.isArray(response.data)) return response.data;
    return [];
  } catch (error) {
    console.error("Error fetching seller matching requests:", error);
    return [];
  }
}