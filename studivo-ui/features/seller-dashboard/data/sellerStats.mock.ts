import { SellerStatItem } from "../types/sellerStats.type";

export const mockSellerStats: SellerStatItem[] = [
  { id: "matching_requests", labelKey: "matching_requests", icon: "FileText", color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30", value: "24", change: "+8" },
  { id: "active_offers", labelKey: "active_offers", icon: "Tag", color: "text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/30", value: "12", change: "+3" },
  { id: "conversion_rate", labelKey: "conversion_rate", icon: "Target", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30", value: "72%", change: "+5%" },
  { id: "revenue", labelKey: "revenue", icon: "DollarSign", color: "text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30", value: "45,000 EGP", change: "+12%" },
];