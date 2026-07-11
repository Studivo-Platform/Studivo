import { SellerOffersStatItem } from "../types/sellerOffersStats.type";

export const mockSellerOffersStats: SellerOffersStatItem[] = [
  { id: "total_offers", labelKey: "total_offers", value: 230, color: "text-indigo-500 dark:text-indigo-400 bg-indigo-950/20 border-indigo-900/30", icon: "Tag" },
  { id: "pending_offers", labelKey: "pending_offers", value: 12, color: "text-amber-500 dark:text-amber-400 bg-amber-950/20 border-amber-900/30", icon: "Clock" },
  { id: "accepted_offers", labelKey: "accepted_offers", value: 165, color: "text-emerald-500 dark:text-emerald-400 bg-emerald-950/20 border-emerald-900/30", icon: "CheckCircle" },
  { id: "rejected_offers", labelKey: "rejected_offers", value: 53, color: "text-rose-500 dark:text-rose-400 bg-rose-950/20 border-rose-900/30", icon: "XCircle" },
];