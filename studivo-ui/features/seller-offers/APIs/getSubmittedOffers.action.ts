import axiosInstance from "@/shared/APIs/axiosInstance";
import { SellerOfferItem } from "../types/submittedOffers.type";

export async function getSubmittedOffersAction(): Promise<SellerOfferItem[]> {
  try {
    const response = await axiosInstance.get("/offers/my");
    const data = response.data?.data;

    // Backend returns paginated: { offers: [...], total, page, limit }
    if (Array.isArray(data?.offers)) return data.offers;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.docs)) return data.docs;
    if (Array.isArray(response.data?.offers)) return response.data.offers;
    if (Array.isArray(response.data)) return response.data;
    return [];
  } catch (error) {
    console.error("Error fetching submitted offers:", error);
    return [];
  }
}