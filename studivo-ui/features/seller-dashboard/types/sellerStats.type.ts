import * as Icons from "lucide-react";

export type SellerStatItem = {
  id: "matching_requests" | "active_offers" | "conversion_rate" | "revenue";
  icon: keyof typeof Icons;
  color: string;
  labelKey: string;
  value: string | number;
  change: string;
};