import axiosInstance from "@/shared/APIs/axiosInstance";
import { SellerStatItem } from "../types/sellerStats.type";

export async function getSellerStatsAction(): Promise<SellerStatItem[]> {
  try {
    const [openReqsRes, myOffersRes] = await Promise.allSettled([
      axiosInstance.get("/requests"),
      axiosInstance.get("/offers/my"),
    ]);

    const openReqs = openReqsRes.status === "fulfilled" ? (openReqsRes.value.data?.data || openReqsRes.value.data || []) : [];
    const myOffers = myOffersRes.status === "fulfilled" ? (myOffersRes.value.data?.data || myOffersRes.value.data || []) : [];

    const reqList = Array.isArray(openReqs) ? openReqs : Array.isArray(openReqs?.docs) ? openReqs.docs : [];
    const offerList = Array.isArray(myOffers) ? myOffers : Array.isArray(myOffers?.docs) ? myOffers.docs : [];

    const acceptedOffersCount = offerList.filter((o: any) => o.status === "accepted").length;

    return [
      { id: "matching_requests", labelKey: "matching_requests", icon: "FileText", color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30", value: reqList.length.toString(), change: `${reqList.length} Open` },
      { id: "active_offers", labelKey: "active_offers", icon: "Tag", color: "text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/30", value: offerList.length.toString(), change: `${offerList.length} Total` },
      { id: "conversion_rate", labelKey: "conversion_rate", icon: "Target", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30", value: acceptedOffersCount.toString(), change: `${acceptedOffersCount} Deals` },
      { id: "revenue", labelKey: "revenue", icon: "DollarSign", color: "text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30", value: `${offerList.reduce((acc: number, o: any) => acc + (o.price || 0), 0).toLocaleString()} EGP`, change: "Total" },
    ];
  } catch (error) {
    console.error("Error fetching seller stats:", error);
    return [
      { id: "matching_requests", labelKey: "matching_requests", icon: "FileText", color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30", value: "0", change: "0 Open" },
      { id: "active_offers", labelKey: "active_offers", icon: "Tag", color: "text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/30", value: "0", change: "0 Total" },
      { id: "conversion_rate", labelKey: "conversion_rate", icon: "Target", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30", value: "0", change: "0 Deals" },
      { id: "revenue", labelKey: "revenue", icon: "DollarSign", color: "text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30", value: "0 EGP", change: "Total" },
    ];
  }
}