export type SellerOffersStatItem = {
  id: "total_offers" | "pending_offers" | "accepted_offers" | "rejected_offers";
  labelKey: string;
  value: number;
  color: string;
  icon: "Tag" | "Clock" | "CheckCircle" | "XCircle";
};