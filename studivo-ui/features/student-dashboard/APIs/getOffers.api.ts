import axiosInstance from "@/shared/APIs/axiosInstance";

export async function getOffersApi(): Promise<any[]> {
  try {
    const response = await axiosInstance.get("/offers/received");
    const data = response.data?.data;
    if (Array.isArray(data?.offers)) return data.offers;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.docs)) return data.docs;
    if (Array.isArray(response.data?.offers)) return response.data.offers;
    if (Array.isArray(response.data)) return response.data;
    return [];
  } catch (error) {
    console.error("Error fetching received offers:", error);
    return [];
  }
}