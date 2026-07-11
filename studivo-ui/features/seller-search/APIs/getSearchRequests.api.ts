import axiosInstance from "@/shared/APIs/axiosInstance";
import { BuyerRequestForSeller } from "../types/search.type";

export async function getBuyerRequestsForSellerApi(search?: string, category?: string): Promise<BuyerRequestForSeller[]> {
  try {
    const params: Record<string, string> = {};
    if (category && category !== "all") params.category = category;

    const response = await axiosInstance.get("/requests", { params });
    const data = response.data?.data;

    // Backend returns paginated: { requests: [...], total, page, limit }
    let list: BuyerRequestForSeller[] = [];
    if (Array.isArray(data?.requests)) list = data.requests;
    else if (Array.isArray(data)) list = data;
    else if (Array.isArray(data?.docs)) list = data.docs;
    else if (Array.isArray(response.data?.requests)) list = response.data.requests;
    else if (Array.isArray(response.data)) list = response.data;

    // Client-side search filter (backend doesn't have text search query param)
    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.rawText?.toLowerCase().includes(q) ||
          r.parsedData?.category?.toLowerCase().includes(q) ||
          r.parsedData?.subCategory?.toLowerCase().includes(q) ||
          r.parsedData?.keywords?.some((k) => k.toLowerCase().includes(q))
      );
    }

    return list;
  } catch (error) {
    console.error("Error fetching buyer requests for seller:", error);
    return [];
  }
}