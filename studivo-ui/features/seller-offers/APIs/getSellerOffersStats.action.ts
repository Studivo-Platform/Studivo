import axiosInstance from "@/shared/APIs/axiosInstance";
import { SellerOffersStatItem } from "../types/sellerOffersStats.type";

export async function getSellerOffersStatsAction(): Promise<SellerOffersStatItem[]> {
  try {
    const response = await axiosInstance.get("/offers/my");
    const data = response.data?.data;

    // Backend returns paginated: { offers: [...], total, page, limit }
    let list: any[] = [];
    if (Array.isArray(data?.offers)) list = data.offers;
    else if (Array.isArray(data)) list = data;
    else if (Array.isArray(data?.docs)) list = data.docs;
    else if (Array.isArray(response.data?.offers)) list = response.data.offers;
    else if (Array.isArray(response.data)) list = response.data;

    const pending = list.filter((o: any) => o.status === "pending").length;
    const accepted = list.filter((o: any) => o.status === "accepted").length;
    const rejected = list.filter((o: any) => o.status === "rejected").length;

    return [
      { id: "total_offers", labelKey: "total_offers", value: list.length, color: "text-indigo-500 dark:text-indigo-400 bg-indigo-950/20 border-indigo-900/30", icon: "Tag" },
      { id: "pending_offers", labelKey: "pending_offers", value: pending, color: "text-amber-500 dark:text-amber-400 bg-amber-950/20 border-amber-900/30", icon: "Clock" },
      { id: "accepted_offers", labelKey: "accepted_offers", value: accepted, color: "text-emerald-500 dark:text-emerald-400 bg-emerald-950/20 border-emerald-900/30", icon: "CheckCircle" },
      { id: "rejected_offers", labelKey: "rejected_offers", value: rejected, color: "text-rose-500 dark:text-rose-400 bg-rose-950/20 border-rose-900/30", icon: "XCircle" },
    ];
  } catch (error) {
    console.error("Error fetching seller offers stats:", error);
    return [
      { id: "total_offers", labelKey: "total_offers", value: 0, color: "text-indigo-500 dark:text-indigo-400 bg-indigo-950/20 border-indigo-900/30", icon: "Tag" },
      { id: "pending_offers", labelKey: "pending_offers", value: 0, color: "text-amber-500 dark:text-amber-400 bg-amber-950/20 border-amber-900/30", icon: "Clock" },
      { id: "accepted_offers", labelKey: "accepted_offers", value: 0, color: "text-emerald-500 dark:text-emerald-400 bg-emerald-950/20 border-emerald-900/30", icon: "CheckCircle" },
      { id: "rejected_offers", labelKey: "rejected_offers", value: 0, color: "text-rose-500 dark:text-rose-400 bg-rose-950/20 border-rose-900/30", icon: "XCircle" },
    ];
  }
}