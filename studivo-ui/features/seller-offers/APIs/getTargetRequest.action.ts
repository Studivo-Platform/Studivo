import axiosInstance from "@/shared/APIs/axiosInstance";
import { TargetRequestSummary } from "../types/targetRequest.type";

export async function getTargetRequestAction(requestId: string): Promise<TargetRequestSummary> {
  const response = await axiosInstance.get(`/requests/${requestId}`);
  const data = response.data?.data;

  // Backend returns { request, offers, scrapedResults }
  return data?.request || data;
}